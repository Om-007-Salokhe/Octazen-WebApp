// Student Routes
import { Router } from 'express';
import { studentController } from './student.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';
import { updateStudentSchema } from './student.schema.js';

const router = Router();

// Admin protected endpoints
router.get('/', adminAuth, studentController.getAll);
router.post('/', adminAuth, studentController.create);
router.get('/:id', adminAuth, studentController.getById);
router.put('/:id', adminAuth, studentController.update);
router.delete('/:id', adminAuth, studentController.remove);
router.post('/:id/reset-devices', adminAuth, studentController.resetDevices);

export default router;
