import type { SessionStart } from '@/features/auth/domain/auth-session';
import { z } from 'zod';

// Corpo de sucesso de POST /auth/login e /auth/register: só a mensagem de retorno interessa ao front
// (a sessão em si vem pelo cookie HttpOnly e é lida depois em GET /auth/me).
const sessionStartResponseSchema = z.object({
  message: z.string().trim().min(1).max(300).optional(),
});

export const parseSessionStart = async (response: Response): Promise<SessionStart> => {
  const body: unknown = await response.json().catch(() => null);

  const parsed = sessionStartResponseSchema.safeParse(body);

  return parsed.success && parsed.data.message ? { message: parsed.data.message } : {};
};
