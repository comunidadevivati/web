import { z } from 'zod';

// Motivos de chegada ao login informados na URL (ex.: /login?reason=expired).
export const loginSearchSchema = z.object({
  reason: z.enum(['expired']).optional(),
});

export type LoginNotice = 'expired' | 'unavailable';
