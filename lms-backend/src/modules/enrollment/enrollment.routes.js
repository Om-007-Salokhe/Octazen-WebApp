// Enrollment Routes
import { Router } from 'express';
import { enrollmentController } from './enrollment.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { studentAuth } from '../../middleware/studentAuth.js';
import { validate } from '../../middleware/validate.js';
import { createEnrollmentSchema } from './enrollment.schema.js';

const router = Router();

// Student routes
router.get('/my-courses', studentAuth, enrollmentController.getMyEnrollments);

// Admin routes
router.post('/', adminAuth, validate(createEnrollmentSchema), enrollmentController.enroll);

export default router;
