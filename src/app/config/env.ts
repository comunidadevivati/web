import { z } from 'zod';

const envSchema = z.object({
  VITE_ENV: z.enum(['development', 'homologation', 'production']),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
