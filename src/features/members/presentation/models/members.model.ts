import type { TranslationKey } from '@/app/i18n/translation-key';
import type { StatusBadgeTone } from '@/components/molecules';
import {
  InvalidMemberDataError,
  MemberAccessDeniedError,
  MemberConflictError,
  MemberNotFoundError,
  type Member,
  type MemberProfile,
  type MemberStatus,
  type MemberStatusAction,
  type MembershipStatus,
  type MembershipStatusAction,
} from '@/features/members/domain/member';
import {
  formatPhone,
  getBrazilianPhoneIssue,
  getPhoneDigits,
} from '@/shared/validation/brazilian-phone';
import { z } from 'zod';

// Limites da Core API.
export const FULL_NAME_MAX_LENGTH = 120;

export const EMAIL_MAX_LENGTH = 254;

export const MEMBER_STATUS_FILTERS = ['ALL', 'ACTIVE', 'INACTIVE', 'ARCHIVED'] as const;

export type MemberStatusFilter = (typeof MEMBER_STATUS_FILTERS)[number];

// Valor do filtro de congregação que representa "todas".
export const ALL_CONGREGATIONS = 'ALL';

export const memberStatusTones: Record<MemberStatus, StatusBadgeTone> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  ARCHIVED: 'neutral',
};

export const membershipStatusTones: Record<MembershipStatus, StatusBadgeTone> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  INACTIVE: 'neutral',
};

// Ações de situação disponíveis para cada situação do membro.
export const memberActionsByStatus: Record<MemberStatus, MemberStatusAction[]> = {
  ACTIVE: ['deactivate'],
  INACTIVE: ['activate', 'archive'],
  ARCHIVED: ['restore'],
};

// Falhas exibidas em Alert nos formulários e em toast nas ações de situação.
export type MembersNotice =
  | 'invalidData'
  | 'conflict'
  | 'notFound'
  | 'accessDenied'
  | 'unavailable';

export const getMembersNotice = (error: Error): MembersNotice => {
  if (error instanceof InvalidMemberDataError) {
    return 'invalidData';
  }

  if (error instanceof MemberConflictError) {
    return 'conflict';
  }

  if (error instanceof MemberNotFoundError) {
    return 'notFound';
  }

  if (error instanceof MemberAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Explicação do servidor para um conflito (ex.: vínculo principal já ativo), quando houver.
export const getConflictDetail = (error: Error | null) => {
  return error instanceof MemberConflictError ? error.detail : undefined;
};

type MemberActionRequest = {
  kind: 'member';
  action: MemberStatusAction;
};

type MembershipActionRequest = {
  kind: 'membership';
  action: MembershipStatusAction;
  membershipId: string;
  congregationName: string;
};

// Ação aguardando confirmação: do membro ou de um vínculo.
export type MembersActionRequest = MemberActionRequest | MembershipActionRequest;

// Mensagens de validação: chaves de tradução do namespace "members".
export const membersValidationMessages = {
  fullNameRequired: 'validation.fullNameRequired',
  fullNameInvalid: 'validation.fullNameInvalid',
  birthDateInvalid: 'validation.birthDateInvalid',
  emailInvalid: 'validation.emailInvalid',
  phoneIncomplete: 'validation.phoneIncomplete',
  phoneInvalidAreaCode: 'validation.phoneInvalidAreaCode',
  phoneInvalidNumber: 'validation.phoneInvalidNumber',
  congregationRequired: 'validation.congregationRequired',
  invalid: 'validation.invalid',
} as const satisfies Record<string, TranslationKey<'members'>>;

const messages = membersValidationMessages;

const phoneIssueMessages = {
  incomplete: messages.phoneIncomplete,
  invalidAreaCode: messages.phoneInvalidAreaCode,
  invalidNumber: messages.phoneInvalidNumber,
} as const;

// Letras (com acento), espaço, apóstrofo, ponto e hífen, como na Core API.
const NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;

// Data civil de hoje (AAAA-MM-DD) no fuso do navegador.
export const getTodayIsoDate = () => {
  return new Date().toLocaleDateString('en-CA');
};

const isValidBirthDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value >= '1900-01-01' &&
    value <= getTodayIsoDate()
  );
};

// Campo opcional: vazio vira null; preenchido, segue a regra do campo.
const optional = <T extends z.ZodType<string, string>>(schema: T) => {
  return z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .pipe(schema.nullable());
};

export const memberFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(1, messages.fullNameRequired)
        .refine(
          (value) =>
            value.length >= 2 &&
            value.length <= FULL_NAME_MAX_LENGTH &&
            NAME_PATTERN.test(value) &&
            /\p{L}/u.test(value),
          messages.fullNameInvalid,
        ),
    ),
  birthDate: optional(
    z.string().refine((value) => isValidBirthDate(value), messages.birthDateInvalid),
  ),
  phone: optional(
    z
      .string()
      .superRefine((value, context) => {
        const issue = getBrazilianPhoneIssue(value);

        if (issue) {
          context.addIssue({ code: 'custom', message: phoneIssueMessages[issue] });
        }
      })
      .transform(getPhoneDigits),
  ),
  email: optional(
    z
      .string()
      .toLowerCase()
      .max(EMAIL_MAX_LENGTH, messages.emailInvalid)
      .pipe(z.email(messages.emailInvalid)),
  ),
});

export type MemberFormInput = z.input<typeof memberFormSchema>;

export type MemberFormData = z.output<typeof memberFormSchema>;

export const toMemberProfile = (data: MemberFormData): MemberProfile => data;

export const toMemberFormInput = (member: Member | null): MemberFormInput => ({
  fullName: member?.fullName ?? '',
  birthDate: member?.birthDate ?? '',
  phone: member?.phone ? formatPhone(member.phone) : '',
  email: member?.email ?? '',
});

export const membershipFormSchema = z.object({
  congregationId: z.string().min(1, messages.congregationRequired),
  primary: z.boolean(),
});

export type MembershipFormInput = z.input<typeof membershipFormSchema>;

export type MembershipFormData = z.output<typeof membershipFormSchema>;
