// Dashboard Module Schemas
import { z } from 'zod';

export const dashboardFilterSchema = z.object({
  query: z.object({
    timeframe: z.enum(['7d', '30d', '90d', 'all']).optional().default('30d'),
  }),
});
