// Material Routes
import { Router } from 'express';
import { materialController } from './material.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';
import { createMaterialSchema } from './material.schema.js';

const router = Router();

router.get('/course/:courseId', materialController.getByCourse);
router.get('/module/:moduleId', materialController.getByModule);

// Materials management
router.post('/', materialController.create);
router.delete('/:id', materialController.remove);

export default router;
