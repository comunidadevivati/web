import type { TranslationKey } from '@/app/i18n/translation-key';
import type { StatusBadgeTone } from '@/components/molecules';
import {
  InvalidMemberDataError,
  MemberAccessDeniedError,
  MemberConflictError,
  MemberNotFoundError,
  type MemberFromUserOutcome,
  type MemberFromUserStatus,
  type MemberStatus,
  type MemberStatusAction,
  type MembershipStatus,
  type MembershipStatusAction,
} from '@/features/members/domain/member';
import { z } from 'zod';

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

// Resumo da conversão de contas em membros, para o toast. Conta que já era membro (convertida por
// outra pessoa ao mesmo tempo) também chegou ao resultado esperado.
export type MemberCreationSummary = {
  created: number;
  total: number;
  // Motivo da única falha, quando houver só uma conta.
  failure: Exclude<MemberFromUserStatus, 'linked' | 'already_linked'> | null;
};

export const summarizeMemberCreation = (
  outcomes: readonly MemberFromUserOutcome[],
): MemberCreationSummary => {
  const failures = outcomes.flatMap(({ status }) =>
    status === 'linked' || status === 'already_linked' ? [] : [status],
  );

  return {
    created: outcomes.length - failures.length,
    total: outcomes.length,
    failure: outcomes.length === 1 ? (failures[0] ?? null) : null,
  };
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
  congregationRequired: 'validation.congregationRequired',
  invalid: 'validation.invalid',
} as const satisfies Record<string, TranslationKey<'members'>>;

const messages = membersValidationMessages;

export const membershipFormSchema = z.object({
  congregationId: z.string().min(1, messages.congregationRequired),
  primary: z.boolean(),
});

export type MembershipFormInput = z.input<typeof membershipFormSchema>;

export type MembershipFormData = z.output<typeof membershipFormSchema>;
