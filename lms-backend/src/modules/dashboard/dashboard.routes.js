// Dashboard Routes
import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';

const router = Router();

// Protected Admin Dashboard Route
router.get('/overview', adminAuth, dashboardController.getOverview);

export default router;
