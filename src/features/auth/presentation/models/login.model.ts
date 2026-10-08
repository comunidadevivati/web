import type { TranslationKey } from '@/app/i18n/translation-key';
import { z } from 'zod';

// As mensagens de validação são chaves de tradução (namespace "auth"), traduzidas na exibição.
const validationMessages = {
  emailRequired: 'login.validation.emailRequired',
  emailInvalid: 'login.validation.emailInvalid',
  passwordRequired: 'login.validation.passwordRequired',
} as const satisfies Record<string, TranslationKey<'auth'>>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, validationMessages.emailRequired)
    .email(validationMessages.emailInvalid),
  password: z.string().min(1, validationMessages.passwordRequired),
});

export type LoginFormData = z.infer<typeof loginSchema>;
