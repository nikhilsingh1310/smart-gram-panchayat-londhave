import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPanchayatMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.panchayatMember.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return res.json({ success: true, members });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getVillageFacilities = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const whereClause: any = {};
    if (category) whereClause.category = category as string;

    const facilities = await prisma.villageFacility.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' }
    });
    return res.json({ success: true, facilities });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getVillageStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.villageStat.findMany();
    return res.json({ success: true, stats });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const whereClause: any = {};
    if (type) whereClause.type = type as any;

    const schedules = await prisma.utilitySchedule.findMany({
      where: whereClause
    });
    return res.json({ success: true, schedules });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getImportantContacts = async (req: Request, res: Response) => {
  try {
    const contacts = [
      { id: '1', nameEn: 'Amalner Police Station', nameMr: 'अमळनेर पोलीस स्टेशन', category: 'Emergency', number: '02587-222100', icon: 'ShieldAlert' },
      { id: '2', nameEn: 'Rural Ambulance / 108', nameMr: 'रुग्णवाहिका १०८ (मोफत)', category: 'Emergency', number: '108', icon: 'Ambulance' },
      { id: '3', nameEn: 'Primary Health Sub-Centre', nameMr: 'प्राथमिक आरोग्य उपकेंद्र लोंढवे', category: 'Health', number: '02587-240102', icon: 'HeartPulse' },
      { id: '4', nameEn: 'Amalner Fire Brigade', nameMr: 'अग्निशामक दल अमळनेर', category: 'Emergency', number: '101', icon: 'Flame' },
      { id: '5', nameEn: 'Gramsevak Office', nameMr: 'ग्रामसेवक कार्यालय लोंढवे', category: 'Official', number: '9422200002', icon: 'Phone' },
      { id: '6', nameEn: 'Talathi Office Londhave', nameMr: 'तलाठी कार्यालय लोंढवे', category: 'Official', number: '9422200088', icon: 'FileText' },
      { id: '7', nameEn: 'Panchayat Samiti BDO Office Amalner', nameMr: 'गट विकास अधिकारी (BDO) अमळनेर', category: 'Government', number: '02587-222305', icon: 'Building' },
      { id: '8', nameEn: 'District Collectorate Jalgaon', nameMr: 'जिल्हाधिकारी कार्यालय जळगाव', category: 'Government', number: '0257-2222001', icon: 'Landmark' },
    ];
    return res.json({ success: true, contacts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getPolls = async (req: Request, res: Response) => {
  try {
    const polls = await prisma.surveyPoll.findMany({
      include: { options: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, polls });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const votePollOption = async (req: AuthRequest, res: Response) => {
  try {
    const { pollId, optionId } = req.body;

    if (!pollId || !optionId) {
      return res.status(400).json({ success: false, error: 'Poll ID and option ID required' });
    }

    const citizenId = req.user ? req.user.id : 'guest-voter';

    // Increment vote count
    const updatedOption = await prisma.surveyOption.update({
      where: { id: optionId },
      data: { voteCount: { increment: 1 } }
    });

    if (req.user) {
      await prisma.surveyResponse.create({
        data: {
          surveyId: pollId,
          optionId: optionId,
          citizenId: req.user.id,
        }
      });
    }

    return res.json({ success: true, option: updatedOption });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getDevelopmentDashboardData = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.villageStat.findMany();
    const facilities = await prisma.villageFacility.findMany();
    const complaintsResolved = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
    const complaintsTotal = await prisma.complaint.count();

    const infrastructureMetrics = [
      { name: 'Internal Concrete Roads', percentage: 88, status: 'Completed' },
      { name: 'Har Ghar Jal Water Supply', percentage: 92, status: 'On Track' },
      { name: 'Solar Streetlights', percentage: 95, status: 'Completed' },
      { name: 'Closed Underground Drainage', percentage: 76, status: 'In Progress' },
      { name: 'Primary School Digital Classroom', percentage: 100, status: 'Completed' },
    ];

    return res.json({
      success: true,
      data: {
        stats,
        facilitiesCount: facilities.length,
        complaintResolutionRate: complaintsTotal > 0 ? Math.round((complaintsResolved / complaintsTotal) * 100) : 100,
        infrastructureMetrics,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
