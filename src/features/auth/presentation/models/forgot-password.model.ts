import type { TranslationKey } from '@/app/i18n/translation-key';
import { EMAIL_MAX_LENGTH } from '@/features/auth/presentation/models/register.model';
import { z } from 'zod';

export type ForgotPasswordNotice = 'tooManyAttempts' | 'unavailable';

// As mensagens de validação são chaves de tradução (namespace "auth"), traduzidas na exibição.
const validationMessages = {
  emailRequired: 'forgotPassword.validation.emailRequired',
  emailTooLong: 'forgotPassword.validation.emailTooLong',
  emailInvalid: 'forgotPassword.validation.emailInvalid',
} as const satisfies Record<string, TranslationKey<'auth'>>;

export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, validationMessages.emailRequired)
    .max(EMAIL_MAX_LENGTH, validationMessages.emailTooLong)
    .pipe(z.email(validationMessages.emailInvalid)),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;
