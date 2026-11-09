import {
  BACKLOG_CARD_DESCRIPTION_MAX_LENGTH,
  BACKLOG_CARD_TITLE_MAX_LENGTH,
  BACKLOG_CARD_TYPES,
  BacklogAccessDeniedError,
  BacklogCardConflictError,
  BacklogCardNotFoundError,
  InvalidBacklogCardDataError,
  type BacklogCard,
} from '@/features/backlog/domain/backlog-card';
import { z } from 'zod';

// Falhas exibidas em Alert (carregamento) e em toast (ações).
export type BacklogNotice =
  | 'invalidData'
  | 'conflict'
  | 'notFound'
  | 'accessDenied'
  | 'unavailable';

export const getBacklogNotice = (error: Error): BacklogNotice => {
  if (error instanceof InvalidBacklogCardDataError) {
    return 'invalidData';
  }

  if (error instanceof BacklogCardConflictError) {
    return 'conflict';
  }

  if (error instanceof BacklogCardNotFoundError) {
    return 'notFound';
  }

  if (error instanceof BacklogAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Explicação do servidor para um conflito, quando houver.
export const getServerDetail = (error: Error) => {
  return error instanceof BacklogCardConflictError ? error.detail : undefined;
};

// Mensagens de validação: chaves de tradução do namespace "backlog".
export const backlogValidationMessages = {
  titleRequired: 'validation.titleRequired',
  titleTooLong: 'validation.titleTooLong',
  descriptionRequired: 'validation.descriptionRequired',
  descriptionTooLong: 'validation.descriptionTooLong',
  invalid: 'validation.invalid',
} as const;

export const backlogCardFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, backlogValidationMessages.titleRequired)
    .max(BACKLOG_CARD_TITLE_MAX_LENGTH, backlogValidationMessages.titleTooLong),
  description: z
    .string()
    .trim()
    .min(1, backlogValidationMessages.descriptionRequired)
    .max(BACKLOG_CARD_DESCRIPTION_MAX_LENGTH, backlogValidationMessages.descriptionTooLong),
  type: z.enum(BACKLOG_CARD_TYPES),
});

export type BacklogCardFormInput = z.input<typeof backlogCardFormSchema>;

export type BacklogCardFormData = z.output<typeof backlogCardFormSchema>;

export const toBacklogCardFormInput = (card: BacklogCard | null): BacklogCardFormInput => {
  return {
    title: card?.title ?? '',
    description: card?.description ?? '',
    type: card?.type ?? 'FEATURE',
  };
};

export const formatBacklogDate = (value: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(value),
  );
};
