import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'londhave_gram_panchayat_secure_jwt_secret_key_2026';

// Citizen OTP Send (Mock SMS)
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit mobile number required' });
    }

    // Generate 6-digit OTP (for dev ease: '123456' or random)
    const code = '123456';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.oTP.create({
      data: {
        mobile,
        code,
        expiresAt,
      }
    });

    console.log(`📱 [DEV SMS MOCK] OTP for mobile ${mobile} is: ${code}`);

    return res.json({
      success: true,
      message: `OTP sent successfully to ${mobile}. (Dev Mock OTP: ${code})`,
      devOTP: code
    });
  } catch (err: any) {
    console.error('Send OTP Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Citizen OTP Verify
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, code, name } = req.body;
    if (!mobile || !code) {
      return res.status(400).json({ success: false, error: 'Mobile and OTP code required' });
    }

    // Check OTP (accept '123456' or match DB)
    const validOtp = await prisma.oTP.findFirst({
      where: {
        mobile,
        code,
        isUsed: false,
        expiresAt: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!validOtp && code !== '123456') {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code' });
    }

    if (validOtp) {
      await prisma.oTP.update({
        where: { id: validOtp.id },
        data: { isUsed: true }
      });
    }

    // Find or Create Citizen User
    let user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          mobile,
          name: name || `Citizen (${mobile.slice(-4)})`,
          role: 'CITIZEN',
          preferredLang: 'mr',
        }
      });
    }

    const token = jwt.sign(
      { id: user.id, mobile: user.mobile, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        preferredLang: user.preferredLang,
        houseNo: user.houseNo,
        wardNo: user.wardNo,
      }
    });
  } catch (err: any) {
    console.error('Verify OTP Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Staff & Admin Login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'ADMIN_LOGIN',
        entity: 'User',
        entityId: user.id,
      }
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        preferredLang: user.preferredLang,
      }
    });
  } catch (err: any) {
    console.error('Admin Login Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get Current Profile
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { department: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        preferredLang: user.preferredLang,
        houseNo: user.houseNo,
        wardNo: user.wardNo,
        address: user.address,
        department: user.department ? user.department.name : null,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update Language Preference
export const updateLanguage = async (req: AuthRequest, res: Response) => {
  try {
    const { lang } = req.body;
    if (!lang || !['en', 'mr', 'hi'].includes(lang)) {
      return res.status(400).json({ success: false, error: 'Invalid language' });
    }

    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { preferredLang: lang }
      });
    }

    return res.json({ success: true, lang });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
