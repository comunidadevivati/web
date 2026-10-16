import type { TranslationKey } from '@/app/i18n/translation-key';
import { z } from 'zod';

// Motivos de chegada ao login informados na URL (ex.: /login?reason=expired).
export const loginSearchSchema = z.object({
  reason: z.enum(['expired']).optional(),
});

export type LoginNotice =
  | 'expired'
  | 'registered'
  | 'invalidCredentials'
  | 'tooManyAttempts'
  | 'unavailable';

// As mensagens de validação são chaves de tradução (namespace "auth"), traduzidas na exibição.
const validationMessages = {
  emailRequired: 'login.validation.emailRequired',
  emailInvalid: 'login.validation.emailInvalid',
  passwordRequired: 'login.validation.passwordRequired',
} as const satisfies Record<string, TranslationKey<'auth'>>;

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, validationMessages.emailRequired)
    .pipe(z.email(validationMessages.emailInvalid)),
  password: z.string().min(1, validationMessages.passwordRequired),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
