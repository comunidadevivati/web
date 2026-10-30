import {
  EMAIL_GROUP_DESCRIPTION_MAX_LENGTH,
  EMAIL_GROUP_NAME_MAX_LENGTH,
  EmailGroupAccessDeniedError,
  EmailGroupConflictError,
  EmailGroupNotFoundError,
  InvalidEmailGroupDataError,
  type EmailGroup,
  type EmailGroupDetails,
} from '@/features/communication/domain/email-group';
import { z } from 'zod';

// Falhas exibidas em Alert (carregamento) e em toast (ações).
export type CommunicationNotice =
  | 'invalidData'
  | 'conflict'
  | 'notFound'
  | 'accessDenied'
  | 'unavailable';

export const getCommunicationNotice = (error: Error): CommunicationNotice => {
  if (error instanceof InvalidEmailGroupDataError) {
    return 'invalidData';
  }

  if (error instanceof EmailGroupConflictError) {
    return 'conflict';
  }

  if (error instanceof EmailGroupNotFoundError) {
    return 'notFound';
  }

  if (error instanceof EmailGroupAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Explicação do servidor para um conflito (ex.: nome repetido), quando houver.
export const getServerDetail = (error: Error | null) => {
  return error instanceof EmailGroupConflictError ? error.detail : undefined;
};

// Mensagens de validação: chaves de tradução do namespace "communication".
export const emailGroupValidationMessages = {
  nameRequired: 'validation.nameRequired',
  nameTooLong: 'validation.nameTooLong',
  descriptionTooLong: 'validation.descriptionTooLong',
  invalid: 'validation.invalid',
} as const;

export const emailGroupEditorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, emailGroupValidationMessages.nameRequired)
    .max(EMAIL_GROUP_NAME_MAX_LENGTH, emailGroupValidationMessages.nameTooLong),
  description: z
    .string()
    .trim()
    .max(EMAIL_GROUP_DESCRIPTION_MAX_LENGTH, emailGroupValidationMessages.descriptionTooLong),
  memberAccountIds: z.array(z.string()),
});

export type EmailGroupEditorInput = z.input<typeof emailGroupEditorSchema>;

export type EmailGroupEditorData = z.output<typeof emailGroupEditorSchema>;

export const toEmailGroupEditorInput = (group: EmailGroup | null): EmailGroupEditorInput => {
  return {
    name: group?.name ?? '',
    description: group?.description ?? '',
    memberAccountIds: group?.memberAccountIds ?? [],
  };
};

export const toEmailGroupDetails = ({
  description,
  memberAccountIds,
  name,
}: EmailGroupEditorData): EmailGroupDetails => {
  return { name, description: description || null, memberAccountIds };
};
