import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as adminController from '../controllers/adminController.js';
import * as contentController from '../controllers/contentController.js';
import * as complaintController from '../controllers/complaintController.js';
import * as taxController from '../controllers/taxController.js';
import * as certificateController from '../controllers/certificateController.js';
import * as utilityController from '../controllers/utilityController.js';
import * as notificationController from '../controllers/notificationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// --- AUTH ROUTES ---
router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/admin-login', authController.adminLogin);
router.get('/auth/me', authenticateToken, authController.getMe);
router.post('/auth/language', authenticateToken, authController.updateLanguage);

// --- ADMIN DASHBOARD & MANAGEMENT ---
router.get('/admin/metrics', authenticateToken, requireRole(['GP_ADMIN', 'SUPER_ADMIN']), adminController.getDashboardMetrics);
router.get('/admin/users', authenticateToken, requireRole(['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN']), adminController.getUsers);
router.post('/admin/users', authenticateToken, requireRole(['GP_ADMIN', 'SUPER_ADMIN']), adminController.createUser);
router.get('/admin/audit-logs', authenticateToken, requireRole(['GP_ADMIN', 'SUPER_ADMIN']), adminController.getAuditLogs);
router.get('/admin/departments', authenticateToken, requireRole(['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN']), adminController.getDepartments);

// --- TRILINGUAL CONTENT CMS ---
router.get('/content', contentController.getContentItems);
router.get('/content/:id', contentController.getContentById);
router.post('/content', authenticateToken, requireRole(['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN']), contentController.createContentItem);
router.put('/content/:id', authenticateToken, requireRole(['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN']), contentController.updateContentItem);
router.delete('/content/:id', authenticateToken, requireRole(['GP_ADMIN', 'SUPER_ADMIN']), contentController.deleteContentItem);

// --- COMPLAINT MANAGEMENT ---
router.get('/complaints', authenticateToken, complaintController.getComplaints);
router.post('/complaints', authenticateToken, complaintController.submitComplaint);
router.put('/complaints/:id/status', authenticateToken, requireRole(['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN']), complaintController.updateComplaintStatus);

// --- TAX PAYMENT & RECEIPTS ---
router.get('/taxes/bills', authenticateToken, taxController.getTaxBills);
router.post('/taxes/pay', authenticateToken, taxController.payTaxBill);
router.get('/taxes/receipt/:id', authenticateToken, taxController.getReceipt);

// --- CERTIFICATES PORTAL ---
router.get('/certificates', authenticateToken, certificateController.getCertificateApps);
router.post('/certificates/apply', authenticateToken, certificateController.applyCertificate);
router.put('/certificates/:id/status', authenticateToken, requireRole(['GP_ADMIN', 'SUPER_ADMIN']), certificateController.updateCertificateStatus);

// --- VILLAGE UTILITIES & PUBLIC DATA ---
router.get('/utilities/panchayat-members', utilityController.getPanchayatMembers);
router.get('/utilities/village-facilities', utilityController.getVillageFacilities);
router.get('/utilities/village-stats', utilityController.getVillageStats);
router.get('/utilities/schedules', utilityController.getSchedules);
router.get('/utilities/contacts', utilityController.getImportantContacts);
router.get('/utilities/polls', utilityController.getPolls);
router.post('/utilities/polls/vote', utilityController.votePollOption);
router.get('/utilities/development-dashboard', utilityController.getDevelopmentDashboardData);

// --- NOTIFICATION SYSTEM ---
router.get('/notifications', notificationController.getNotifications);
router.post('/notifications/broadcast', authenticateToken, requireRole(['GP_ADMIN', 'SUPER_ADMIN']), notificationController.broadcastNotification);

export default router;
