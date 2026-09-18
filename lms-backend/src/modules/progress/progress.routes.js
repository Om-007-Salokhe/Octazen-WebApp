// Progress Routes
import { Router } from 'express';
import { progressController } from './progress.controller.js';
import { studentAuth } from '../../middleware/studentAuth.js';
import { validate } from '../../middleware/validate.js';
import { updateProgressSchema } from './progress.schema.js';

const router = Router();

router.use(studentAuth);
router.post('/record', validate(updateProgressSchema), progressController.recordProgress);
router.get('/course/:courseId', progressController.getCourseProgress);

export default router;
