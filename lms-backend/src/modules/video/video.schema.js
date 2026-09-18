// Video Module Schemas
import { z } from 'zod';

export const createVideoSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid('Invalid module ID'),
    title: z.string().min(2, 'Video title is required'),
    description: z.string().optional(),
    bunnyVideoId: z.string().min(1, 'Bunny Video ID is required'),
    durationSeconds: z.number().int().nonnegative().optional().default(0),
    orderIndex: z.number().int().optional().default(0),
  }),
});
