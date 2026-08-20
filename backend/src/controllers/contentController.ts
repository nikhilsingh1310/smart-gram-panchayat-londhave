import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { ContentType, ContentStatus } from '@prisma/client';

export const getContentItems = async (req: Request, res: Response) => {
  try {
    const { type, status, category, pinned, lang = 'en', search } = req.query;

    const whereClause: any = {};
    if (type) whereClause.type = type as ContentType;
    if (status) whereClause.status = status as ContentStatus;
    if (category) whereClause.category = category as string;
    if (pinned !== undefined) whereClause.isPinned = pinned === 'true';

    const items = await prisma.contentItem.findMany({
      where: whereClause,
      include: {
        translations: true,
        author: { select: { id: true, name: true, role: true } }
      },
      orderBy: [
        { isPinned: 'desc' },
        { publishAt: 'desc' }
      ]
    });

    // Format content with language selection + fallback indicator
    const formattedItems = items.map(item => {
      const targetTranslation = item.translations.find(t => t.lang === (lang as string));
      const fallbackTranslation = item.translations.find(t => t.lang === 'en') || item.translations[0];

      const activeTranslation = targetTranslation || fallbackTranslation;
      const isFallback = !targetTranslation && !!fallbackTranslation;

      return {
        id: item.id,
        type: item.type,
        status: item.status,
        category: item.category,
        isPinned: item.isPinned,
        publishAt: item.publishAt,
        mediaUrl: item.mediaUrl,
        docUrl: item.docUrl,
        author: item.author,
        translation: activeTranslation ? {
          title: activeTranslation.title,
          subtitle: activeTranslation.subtitle,
          body: activeTranslation.body,
          metadata: activeTranslation.metadata,
          lang: activeTranslation.lang
        } : null,
        isFallback,
        missingLangs: ['en', 'mr', 'hi'].filter(l => !item.translations.some(t => t.lang === l)),
        allTranslations: item.translations
      };
    });

    return res.json({ success: true, items: formattedItems });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: { translations: true, author: { select: { name: true } } }
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Content item not found' });
    }

    return res.json({ success: true, item });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createContentItem = async (req: AuthRequest, res: Response) => {
  try {
    const { type, status, category, isPinned, publishAt, mediaUrl, docUrl, translations } = req.body;

    if (!type || !translations || !translations.en) {
      return res.status(400).json({ success: false, error: 'Type and English translation required' });
    }

    // Build translation records for EN, MR, HI
    const translationRecords: Array<{ lang: string; title: string; subtitle?: string; body: string; metadata?: any }> = [];

    ['en', 'mr', 'hi'].forEach(l => {
      if (translations[l] && translations[l].title) {
        translationRecords.push({
          lang: l,
          title: translations[l].title,
          subtitle: translations[l].subtitle || null,
          body: translations[l].body || '',
          metadata: translations[l].metadata || null
        });
      }
    });

    const item = await prisma.contentItem.create({
      data: {
        type: type as ContentType,
        status: (status as ContentStatus) || 'PUBLISHED',
        category: category || null,
        isPinned: !!isPinned,
        publishAt: publishAt ? new Date(publishAt) : new Date(),
        mediaUrl: mediaUrl || null,
        docUrl: docUrl || null,
        authorId: req.user ? req.user.id : null,
        translations: {
          create: translationRecords
        }
      },
      include: { translations: true }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'CREATE_CONTENT',
          entity: 'ContentItem',
          entityId: item.id,
          details: { type: item.type, title: translations.en.title }
        }
      });
    }

    return res.json({ success: true, item });
  } catch (err: any) {
    console.error('Create Content Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateContentItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, status, category, isPinned, mediaUrl, docUrl, translations } = req.body;

    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Content item not found' });
    }

    // Delete existing translations and recreate
    if (translations) {
      await prisma.contentTranslation.deleteMany({ where: { contentItemId: id } });
    }

    const translationRecords: Array<{ lang: string; title: string; subtitle?: string; body: string; metadata?: any }> = [];
    if (translations) {
      ['en', 'mr', 'hi'].forEach(l => {
        if (translations[l] && translations[l].title) {
          translationRecords.push({
            lang: l,
            title: translations[l].title,
            subtitle: translations[l].subtitle || null,
            body: translations[l].body || '',
            metadata: translations[l].metadata || null
          });
        }
      });
    }

    const item = await prisma.contentItem.update({
      where: { id },
      data: {
        type: type ? (type as ContentType) : undefined,
        status: status ? (status as ContentStatus) : undefined,
        category: category !== undefined ? category : undefined,
        isPinned: isPinned !== undefined ? !!isPinned : undefined,
        mediaUrl: mediaUrl !== undefined ? mediaUrl : undefined,
        docUrl: docUrl !== undefined ? docUrl : undefined,
        translations: translationRecords.length > 0 ? {
          create: translationRecords
        } : undefined
      },
      include: { translations: true }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'UPDATE_CONTENT',
          entity: 'ContentItem',
          entityId: item.id,
        }
      });
    }

    return res.json({ success: true, item });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteContentItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contentItem.delete({ where: { id } });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'DELETE_CONTENT',
          entity: 'ContentItem',
          entityId: id,
        }
      });
    }

    return res.json({ success: true, message: 'Content deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
