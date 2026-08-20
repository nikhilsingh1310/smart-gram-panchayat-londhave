import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@prisma/client';

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const { status, category, priority, wardNo, search } = req.query;

    const whereClause: any = {};

    // If citizen role, restrict to their own complaints
    if (req.user && req.user.role === 'CITIZEN') {
      whereClause.citizenId = req.user.id;
    } else if (req.user && req.user.role === 'EMPLOYEE') {
      // Employees see assigned or all complaints
      whereClause.OR = [
        { assignedToId: req.user.id },
        { status: 'PENDING' }
      ];
    }

    if (status) whereClause.status = status as ComplaintStatus;
    if (category) whereClause.category = category as ComplaintCategory;
    if (priority) whereClause.priority = priority as ComplaintPriority;
    if (wardNo) whereClause.wardNo = wardNo as string;

    if (search) {
      whereClause.AND = {
        OR: [
          { ticketNo: { contains: search as string, mode: 'insensitive' } },
          { title: { contains: search as string, mode: 'insensitive' } },
          { citizenName: { contains: search as string, mode: 'insensitive' } },
        ]
      };
    }

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        citizen: { select: { name: true, mobile: true, wardNo: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        history: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, complaints });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const submitComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, priority, location, wardNo, photoUrl } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ success: false, error: 'Title, description, category, and location required' });
    }

    const citizenId = req.user ? req.user.id : null;
    let citizenName = req.user ? req.user.name : 'Anonymous Guest';
    let citizenMobile = req.user ? req.user.mobile || '9999999999' : '9999999999';

    if (!citizenId) {
      return res.status(401).json({ success: false, error: 'Please log in to submit a complaint' });
    }

    // Generate unique Ticket No
    const count = await prisma.complaint.count();
    const ticketNo = `LND-CMP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const complaint = await prisma.complaint.create({
      data: {
        ticketNo,
        citizenId,
        citizenName,
        citizenMobile,
        category: category as ComplaintCategory,
        priority: (priority as ComplaintPriority) || 'MEDIUM',
        status: 'PENDING',
        title,
        description,
        location,
        wardNo: wardNo || '1',
        photoUrl: photoUrl || null,
        history: {
          create: {
            oldStatus: 'PENDING',
            newStatus: 'PENDING',
            actorName: citizenName,
            remarks: 'Complaint registered by citizen.'
          }
        }
      }
    });

    return res.json({ success: true, complaint });
  } catch (err: any) {
    console.error('Submit Complaint Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedToId, resolutionRemarks, resolutionPhotoUrl } = req.body;

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }

    const oldStatus = complaint.status;
    const newStatus = (status as ComplaintStatus) || oldStatus;

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: newStatus,
        assignedToId: assignedToId !== undefined ? assignedToId : complaint.assignedToId,
        resolutionRemarks: resolutionRemarks || complaint.resolutionRemarks,
        resolutionPhotoUrl: resolutionPhotoUrl || complaint.resolutionPhotoUrl,
        history: {
          create: {
            oldStatus,
            newStatus,
            actorId: req.user ? req.user.id : null,
            actorName: req.user ? req.user.name : 'Staff Member',
            remarks: resolutionRemarks || `Status updated from ${oldStatus} to ${newStatus}`
          }
        }
      },
      include: { history: true, assignedTo: true }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'UPDATE_COMPLAINT',
          entity: 'Complaint',
          entityId: id,
          details: { oldStatus, newStatus, ticketNo: complaint.ticketNo }
        }
      });
    }

    return res.json({ success: true, complaint: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
