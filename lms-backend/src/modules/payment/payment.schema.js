// Payment Module Schemas (Track 3)
import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().default('INR'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    transactionId: z.string().min(1),
    paymentSignature: z.string().min(1),
    orderId: z.string().min(1),
  }),
});
