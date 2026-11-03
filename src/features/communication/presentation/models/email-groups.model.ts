import {
  EMAIL_GROUP_DESCRIPTION_MAX_LENGTH,
  EMAIL_GROUP_NAME_MAX_LENGTH,
  EMAIL_GROUP_TYPES,
  EmailGroupAccessDeniedError,
  EmailGroupConflictError,
  EmailGroupNotFoundError,
  InvalidEmailGroupDataError,
  acceptsAccounts,
  acceptsExternalEmails,
  isValidEmail,
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
  type: z.enum(EMAIL_GROUP_TYPES),
  memberAccountIds: z.array(z.string()),
  externalEmails: z.array(z.string()),
});

export type EmailGroupEditorInput = z.input<typeof emailGroupEditorSchema>;

export type EmailGroupEditorData = z.output<typeof emailGroupEditorSchema>;

export const toEmailGroupEditorInput = (group: EmailGroup | null): EmailGroupEditorInput => {
  return {
    name: group?.name ?? '',
    description: group?.description ?? '',
    type: group?.type ?? 'RESTRICTED',
    memberAccountIds: group?.memberAccountIds ?? [],
    externalEmails: group?.externalEmails ?? [],
  };
};

// A lista que o tipo não aceita vai vazia: trocar de tipo descarta o que ficou escondido.
export const toEmailGroupDetails = ({
  description,
  externalEmails,
  memberAccountIds,
  name,
  type,
}: EmailGroupEditorData): EmailGroupDetails => {
  return {
    name,
    description: description || null,
    type,
    memberAccountIds: acceptsAccounts(type) ? memberAccountIds : [],
    externalEmails: acceptsExternalEmails(type) ? externalEmails : [],
  };
};

// Resultado de interpretar o texto digitado (ou colado) no campo de e-mails avulsos.
export type ExternalEmailsParse = {
  // Novos e válidos, em minúsculas e sem repetição.
  added: string[];
  // Trechos que não são e-mails.
  invalid: string[];
  // Já estavam no grupo.
  duplicates: string[];
};

// Aceita vários e-mails de uma vez, separados por vírgula, ponto e vírgula, espaço ou quebra de linha
// (ex.: uma coluna colada de uma planilha).
export const parseExternalEmails = (
  text: string,
  current: readonly string[],
): ExternalEmailsParse => {
  const known = new Set(current);

  const result: ExternalEmailsParse = { added: [], invalid: [], duplicates: [] };

  for (const piece of text.split(/[\s,;]+/u)) {
    const email = piece.trim().toLowerCase();

    if (email === '') {
      continue;
    }

    if (!isValidEmail(email)) {
      result.invalid.push(piece.trim());
    } else if (known.has(email)) {
      result.duplicates.push(email);
    } else {
      known.add(email);

      result.added.push(email);
    }
  }

  return result;
};
