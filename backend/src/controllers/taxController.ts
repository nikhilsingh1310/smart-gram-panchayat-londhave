import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getTaxBills = async (req: AuthRequest, res: Response) => {
  try {
    const { status, citizenId } = req.query;
    const whereClause: any = {};

    if (req.user && req.user.role === 'CITIZEN') {
      whereClause.citizenId = req.user.id;
    } else if (citizenId) {
      whereClause.citizenId = citizenId as string;
    }

    if (status) whereClause.status = status as string;

    const bills = await prisma.taxBill.findMany({
      where: whereClause,
      include: { payments: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, bills });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const payTaxBill = async (req: AuthRequest, res: Response) => {
  try {
    const { billId, paymentMethod = 'UPI' } = req.body;

    if (!billId) {
      return res.status(400).json({ success: false, error: 'Bill ID required' });
    }

    const bill = await prisma.taxBill.findUnique({ where: { id: billId } });
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Tax bill not found' });
    }

    if (bill.status === 'PAID') {
      return res.status(400).json({ success: false, error: 'This bill has already been paid' });
    }

    const randomTxnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomReceiptNo = `LND-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        transactionId: randomTxnId,
        billId: bill.id,
        citizenId: bill.citizenId,
        citizenName: bill.citizenName,
        amount: bill.amount,
        paymentMethod,
        status: 'SUCCESS',
        receiptNo: randomReceiptNo,
      }
    });

    await prisma.taxBill.update({
      where: { id: billId },
      data: { status: 'PAID' }
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'TAX_PAYMENT',
          entity: 'Payment',
          entityId: payment.id,
          details: { billNo: bill.billNo, amount: bill.amount, receiptNo: payment.receiptNo }
        }
      });
    }

    return res.json({
      success: true,
      message: 'Payment completed successfully!',
      payment,
      receiptUrl: `/api/taxes/receipt/${payment.id}`
    });
  } catch (err: any) {
    console.error('Pay Tax Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getReceipt = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { taxBill: true, citizen: true }
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Receipt not found' });
    }

    return res.json({ success: true, payment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
