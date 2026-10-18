import { z } from 'zod';

const VERIFICATION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;

// Estado da tela: verificando, ou falhou (o sucesso navega direto para a aplicação).
export type VerifyEmailNotice = 'invalidLink' | 'unavailable';

export const verifyEmailSearchSchema = z
  .object({
    token: z.string().optional(),
  })
  .transform(({ token }) => ({
    token: token && VERIFICATION_TOKEN_PATTERN.test(token) ? token : undefined,
  }));
