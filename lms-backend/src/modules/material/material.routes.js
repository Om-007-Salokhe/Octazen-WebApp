// Material Routes
import { Router } from 'express';
import { materialController } from './material.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';
import { createMaterialSchema } from './material.schema.js';

const router = Router();

router.get('/module/:moduleId', materialController.getByModule);

// Admin Protected
router.post('/', adminAuth, validate(createMaterialSchema), materialController.create);
router.delete('/:id', adminAuth, materialController.remove);

export default router;
