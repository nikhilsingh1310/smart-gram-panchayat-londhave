import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import * as utils from 'util';

export const getDashboardMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const totalCitizens = await prisma.user.count({ where: { role: 'CITIZEN' } });
    const totalEmployees = await prisma.user.count({ where: { role: { in: ['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN'] } } });
    const totalComplaints = await prisma.complaint.count();
    const resolvedComplaints = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
    const pendingComplaints = await prisma.complaint.count({ where: { status: 'PENDING' } });
    const inProgressComplaints = await prisma.complaint.count({ where: { status: 'IN_PROGRESS' } });

    const totalTaxBillAmountResult = await prisma.taxBill.aggregate({
      _sum: { amount: true }
    });

    const paidTaxResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' }
    });

    const totalTaxCollected = paidTaxResult._sum.amount || 0;
    const totalTaxBilled = totalTaxBillAmountResult._sum.amount || 0;

    const totalSchemes = await prisma.contentItem.count({
      where: { type: 'SCHEME', status: 'PUBLISHED' }
    });

    // Scheme beneficiaries from stats
    const schemeStat = await prisma.villageStat.findUnique({ where: { key: 'scheme_beneficiaries' } });
    const schemeBeneficiaries = schemeStat ? schemeStat.value : '890';

    // Chart Data 1: Complaints by Category
    const complaintsByCategoryRaw = await prisma.complaint.groupBy({
      by: ['category'],
      _count: { id: true }
    });
    const complaintsByCategory = complaintsByCategoryRaw.map(c => ({
      category: c.category,
      count: c._count.id
    }));

    // Chart Data 2: Tax Collection by Tax Type
    const taxByTypeRaw = await prisma.taxBill.groupBy({
      by: ['taxType', 'status'],
      _sum: { amount: true }
    });
    const taxByType = taxByTypeRaw.map(t => ({
      taxType: t.taxType,
      status: t.status,
      amount: t._sum.amount || 0
    }));

    // Chart Data 3: Complaints by Status
    const complaintStatusBreakdown = [
      { name: 'Pending', count: pendingComplaints, fill: '#f59e0b' },
      { name: 'In Progress', count: inProgressComplaints, fill: '#3b82f6' },
      { name: 'Resolved', count: resolvedComplaints, fill: '#10b981' }
    ];

    // Recent Activity / Audit Logs
    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      metrics: {
        totalCitizens,
        totalEmployees,
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        inProgressComplaints,
        totalTaxCollected,
        totalTaxBilled,
        totalSchemes,
        schemeBeneficiaries,
      },
      charts: {
        complaintsByCategory,
        taxByType,
        complaintStatusBreakdown
      },
      recentActivity: recentAuditLogs
    });
  } catch (err: any) {
    console.error('Metrics Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query;
    const whereClause: any = {};

    if (role) {
      whereClause.role = role as string;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { mobile: { contains: search as string } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: { department: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, mobile, email, password, role, departmentId, houseNo, wardNo, address } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    let passwordHash = undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.create({
      data: {
        name,
        mobile: mobile || null,
        email: email || null,
        passwordHash,
        role: role || 'CITIZEN',
        departmentId: departmentId || null,
        houseNo: houseNo || null,
        wardNo: wardNo || null,
        address: address || null,
      }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'CREATE_USER',
          entity: 'User',
          entityId: user.id,
          details: { name: user.name, role: user.role }
        }
      });
    }

    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: { users: true }
    });
    return res.json({ success: true, departments });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
