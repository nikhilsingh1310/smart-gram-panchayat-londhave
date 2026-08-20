import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { sentAt: 'desc' }
    });
    return res.json({ success: true, notifications });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const broadcastNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, channel = 'PUSH', audience = 'ALL' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message required' });
    }

    const notification = await prisma.notification.create({
      data: {
        channel,
        audience,
        title,
        message,
        status: 'SENT',
      }
    });

    console.log(`📢 [BROADCAST STUB] Sent ${channel} broadcast to ${audience}: "${title}" - ${message}`);

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'BROADCAST_NOTIFICATION',
          entity: 'Notification',
          entityId: notification.id,
          details: { title, channel, audience }
        }
      });
    }

    return res.json({ success: true, notification });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
