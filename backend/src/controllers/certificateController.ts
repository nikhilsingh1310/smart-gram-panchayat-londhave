import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { CertType, CertStatus } from '@prisma/client';

export const getCertificateApps = async (req: AuthRequest, res: Response) => {
  try {
    const { status, certType } = req.query;
    const whereClause: any = {};

    if (req.user && req.user.role === 'CITIZEN') {
      whereClause.citizenId = req.user.id;
    }

    if (status) whereClause.status = status as CertStatus;
    if (certType) whereClause.certType = certType as CertType;

    const apps = await prisma.certificateApp.findMany({
      where: whereClause,
      include: { citizen: { select: { name: true, mobile: true, wardNo: true } } },
      orderBy: { appliedAt: 'desc' }
    });

    return res.json({ success: true, apps });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const applyCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { certType, applicantDetails, docUrls } = req.body;

    if (!certType || !applicantDetails) {
      return res.status(400).json({ success: false, error: 'Certificate type and applicant details required' });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User login required' });
    }

    const count = await prisma.certificateApp.count();
    const applicationNo = `LND-CERT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const app = await prisma.certificateApp.create({
      data: {
        applicationNo,
        citizenId: req.user.id,
        citizenName: req.user.name,
        citizenMobile: req.user.mobile || '9999999999',
        certType: certType as CertType,
        status: 'SUBMITTED',
        applicantDetails: applicantDetails,
        docUrls: docUrls || [],
      }
    });

    return res.json({ success: true, application: app });
  } catch (err: any) {
    console.error('Apply Certificate Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCertificateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks, issuedCertUrl } = req.body;

    const app = await prisma.certificateApp.findUnique({ where: { id } });
    if (!app) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const updated = await prisma.certificateApp.update({
      where: { id },
      data: {
        status: status as CertStatus,
        adminRemarks: adminRemarks || app.adminRemarks,
        issuedCertUrl: issuedCertUrl || (status === 'APPROVED' ? `/certificates/issued_${app.applicationNo}.pdf` : app.issuedCertUrl),
        processedAt: new Date(),
      }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'UPDATE_CERTIFICATE',
          entity: 'CertificateApp',
          entityId: id,
          details: { status, applicationNo: app.applicationNo }
        }
      });
    }

    return res.json({ success: true, application: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
