import type { TranslationKey } from '@/app/i18n/translation-key';
import { getBrazilianPhoneIssue, getPhoneDigits } from '@/shared/validation/brazilian-phone';
import {
  getPasswordStrength,
  getPersonalInfoTerms,
  hasEdgeWhitespace,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/shared/validation/password-strength';
import { z } from 'zod';

export const FULL_NAME_MAX_LENGTH = 120;

export const EMAIL_MAX_LENGTH = 254;

export type RegisterNotice = 'invalidData' | 'tooManyAttempts' | 'unavailable';

// As mensagens de validação são chaves de tradução (namespace "auth"), traduzidas na exibição.
export const registerValidationMessages = {
  fullNameRequired: 'register.validation.fullNameRequired',
  fullNameTooLong: 'register.validation.fullNameTooLong',
  fullNameInvalidCharacters: 'register.validation.fullNameInvalidCharacters',
  fullNameIncomplete: 'register.validation.fullNameIncomplete',
  phoneRequired: 'register.validation.phoneRequired',
  phoneIncomplete: 'register.validation.phoneIncomplete',
  phoneInvalidAreaCode: 'register.validation.phoneInvalidAreaCode',
  phoneInvalidNumber: 'register.validation.phoneInvalidNumber',
  emailRequired: 'register.validation.emailRequired',
  emailTooLong: 'register.validation.emailTooLong',
  emailInvalid: 'register.validation.emailInvalid',
  emailTaken: 'register.validation.emailTaken',
  passwordRequired: 'register.validation.passwordRequired',
  passwordTooShort: 'register.validation.passwordTooShort',
  passwordTooLong: 'register.validation.passwordTooLong',
  passwordEdgeWhitespace: 'register.validation.passwordEdgeWhitespace',
  passwordWeak: 'register.validation.passwordWeak',
  confirmPasswordRequired: 'register.validation.confirmPasswordRequired',
  passwordMismatch: 'register.validation.passwordMismatch',
} as const satisfies Record<string, TranslationKey<'auth'>>;

const phoneIssueMessages = {
  incomplete: registerValidationMessages.phoneIncomplete,
  invalidAreaCode: registerValidationMessages.phoneInvalidAreaCode,
  invalidNumber: registerValidationMessages.phoneInvalidNumber,
} as const;

// Letras (com acento), espaço, apóstrofo, hífen e ponto (ex.: "Maria D'Ávila Santos-Lima").
const FULL_NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;

const getNameWords = (value: string) => {
  return value.split(' ').filter(Boolean);
};

// Também usado pela gestão de usuários (mesmas regras do cadastro).
export const fullNameSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ' '))
  .pipe(
    z
      .string()
      .min(1, registerValidationMessages.fullNameRequired)
      .max(FULL_NAME_MAX_LENGTH, registerValidationMessages.fullNameTooLong)
      .regex(FULL_NAME_PATTERN, registerValidationMessages.fullNameInvalidCharacters)
      .refine((value) => {
        const words = getNameWords(value);

        // Nome e sobrenome, com pelo menos 2 letras no primeiro e no último.
        return (
          words.length >= 2 &&
          (words.at(0)?.replace(/\P{L}/gu, '').length ?? 0) >= 2 &&
          (words.at(-1)?.replace(/\P{L}/gu, '').length ?? 0) >= 2
        );
      }, registerValidationMessages.fullNameIncomplete),
  );

// Também usado pela gestão de usuários (mesmas regras do cadastro).
export const phoneSchema = z
  .string()
  .min(1, registerValidationMessages.phoneRequired)
  .superRefine((value, context) => {
    const issue = getBrazilianPhoneIssue(value);

    if (issue) {
      context.addIssue({
        code: 'custom',
        message: phoneIssueMessages[issue],
      });
    }
  })
  .transform(getPhoneDigits);

// Também usado pela gestão de usuários (mesmas regras do cadastro).
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, registerValidationMessages.emailRequired)
  .max(EMAIL_MAX_LENGTH, registerValidationMessages.emailTooLong)
  .pipe(z.email(registerValidationMessages.emailInvalid));

const passwordSchema = z
  .string()
  .min(1, registerValidationMessages.passwordRequired)
  .min(PASSWORD_MIN_LENGTH, registerValidationMessages.passwordTooShort)
  .max(PASSWORD_MAX_LENGTH, registerValidationMessages.passwordTooLong)
  .refine((value) => !hasEdgeWhitespace(value), registerValidationMessages.passwordEdgeWhitespace);

export const registerFormSchema = z
  .object({
    fullName: fullNameSchema,
    phone: phoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, registerValidationMessages.confirmPasswordRequired),
  })
  // As regras entre campos rodam mesmo com outros campos inválidos (when), para o botão e as
  // mensagens refletirem o estado real do formulário.
  .refine(
    ({ email, fullName, password }) =>
      getPasswordStrength(password, getPersonalInfoTerms(fullName, email)) !== 'weak',
    {
      message: registerValidationMessages.passwordWeak,
      path: ['password'],
      when: () => true,
    },
  )
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: registerValidationMessages.passwordMismatch,
    path: ['confirmPassword'],
    when: () => true,
  });

export type RegisterFormInput = z.input<typeof registerFormSchema>;

export type RegisterFormData = z.output<typeof registerFormSchema>;
