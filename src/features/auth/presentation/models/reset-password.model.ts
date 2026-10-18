import type { TranslationKey } from '@/app/i18n/translation-key';
import {
  getPasswordStrength,
  hasEdgeWhitespace,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/shared/validation/password-strength';
import { z } from 'zod';

const RESET_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;

export type ResetPasswordNotice = 'invalidLink' | 'tooManyAttempts' | 'unavailable';

export const resetPasswordValidationMessages = {
  passwordRequired: 'resetPassword.validation.passwordRequired',
  passwordTooShort: 'resetPassword.validation.passwordTooShort',
  passwordTooLong: 'resetPassword.validation.passwordTooLong',
  passwordEdgeWhitespace: 'resetPassword.validation.passwordEdgeWhitespace',
  passwordWeak: 'resetPassword.validation.passwordWeak',
  confirmPasswordRequired: 'resetPassword.validation.confirmPasswordRequired',
  passwordMismatch: 'resetPassword.validation.passwordMismatch',
} as const satisfies Record<string, TranslationKey<'auth'>>;

const passwordSchema = z
  .string()
  .min(1, resetPasswordValidationMessages.passwordRequired)
  .min(PASSWORD_MIN_LENGTH, resetPasswordValidationMessages.passwordTooShort)
  .max(PASSWORD_MAX_LENGTH, resetPasswordValidationMessages.passwordTooLong)
  .refine(
    (password) => !hasEdgeWhitespace(password),
    resetPasswordValidationMessages.passwordEdgeWhitespace,
  );

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, resetPasswordValidationMessages.confirmPasswordRequired),
  })
  .refine(({ password }) => getPasswordStrength(password) !== 'weak', {
    message: resetPasswordValidationMessages.passwordWeak,
    path: ['password'],
    when: () => true,
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: resetPasswordValidationMessages.passwordMismatch,
    path: ['confirmPassword'],
    when: () => true,
  });

export const resetPasswordSearchSchema = z
  .object({
    token: z.string().optional(),
  })
  .transform(({ token }) => ({
    token: token && RESET_TOKEN_PATTERN.test(token) ? token : undefined,
  }));

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
