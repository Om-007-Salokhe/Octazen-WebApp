// Course Routes
import { Router } from 'express';
import { courseController } from './course.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';
import { createCourseSchema, updateCourseSchema } from './course.schema.js';

const router = Router();

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);

// Protected Admin Routes
router.post('/', adminAuth, validate(createCourseSchema), courseController.create);
router.put('/:id', adminAuth, validate(updateCourseSchema), courseController.update);
router.delete('/:id', adminAuth, courseController.remove);

export default router;
