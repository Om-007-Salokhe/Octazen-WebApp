// Enrollment Module Schemas
import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    courseId: z.string().uuid(),
    expiresAt: z.string().datetime().optional(),
  }),
});
