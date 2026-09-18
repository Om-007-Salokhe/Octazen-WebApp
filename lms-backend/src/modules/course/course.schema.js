// Course Module Schemas
import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Course title is required'),
    slug: z.string().min(3, 'Course slug is required'),
    description: z.string().optional(),
    price: z.number().nonnegative().optional().default(0),
    isPublished: z.boolean().optional().default(false),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid course ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().nonnegative().optional(),
    isPublished: z.boolean().optional(),
  }),
});
