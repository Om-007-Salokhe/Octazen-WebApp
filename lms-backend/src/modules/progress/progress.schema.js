// Progress Module Schemas
import { z } from 'zod';

export const updateProgressSchema = z.object({
  body: z.object({
    videoId: z.string().uuid('Invalid video ID'),
    watchedSeconds: z.number().int().nonnegative(),
    isCompleted: z.boolean().optional().default(false),
  }),
});
