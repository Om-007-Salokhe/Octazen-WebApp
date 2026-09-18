// Payment Routes (Track 3)
import { Router } from 'express';
import { paymentController } from './payment.controller.js';
import { studentAuth } from '../../middleware/studentAuth.js';
import { validate } from '../../middleware/validate.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from './payment.schema.js';

const router = Router();

router.use(studentAuth);
router.post('/order', validate(createPaymentOrderSchema), paymentController.createOrder);
router.post('/verify', validate(verifyPaymentSchema), paymentController.verify);

export default router;
