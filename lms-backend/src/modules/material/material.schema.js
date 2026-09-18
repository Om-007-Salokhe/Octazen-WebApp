// Material Module Schemas
import { z } from 'zod';

export const createMaterialSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid('Invalid module ID'),
    title: z.string().min(2, 'Material title is required'),
    fileUrl: z.string().min(1, 'File URL is required'),
    fileType: z.string().optional(),
    fileSizeBytes: z.number().optional(),
    orderIndex: z.number().int().optional().default(0),
  }),
});
