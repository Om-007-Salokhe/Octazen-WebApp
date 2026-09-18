// Auth Routes with JWT Protected Verification
import { Router } from 'express';
import { authController } from './auth.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';
import { adminLoginSchema, studentLoginSchema } from './auth.schema.js';
import { authLimiter } from '../../middleware/rateLimit.js';

const router = Router();

// Admin Login -> returns JWT Access Token
router.post('/admin/login', authLimiter, validate(adminLoginSchema), authController.adminLogin);

// Student Login -> returns JWT Access Token
router.post('/student/login', authLimiter, validate(studentLoginSchema), authController.studentLogin);

// Verify current session & JWT payload
router.get('/me', adminAuth, authController.getCurrentUser);

export default router;
