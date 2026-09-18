// Auth Zod Validation Schemas
import { z } from 'zod';

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Please enter your username or email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export const studentLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid student email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    deviceFingerprint: z.string().min(1, 'Device fingerprint identifier is required'),
    deviceName: z.string().optional(),
  }),
});

export const studentRegisterSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phoneNumber: z.string().optional(),
    deviceFingerprint: z.string().min(1, 'Device fingerprint is required'),
  }),
});
