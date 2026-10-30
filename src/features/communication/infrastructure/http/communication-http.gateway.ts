import {
  CommunicationUnavailableError,
  EmailGroupAccessDeniedError,
  EmailGroupConflictError,
  EmailGroupNotFoundError,
  InvalidEmailGroupDataError,
  type CommunicationGateway,
} from '@/features/communication/domain/email-group';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos do BFF (ADR 0013): /api/v1/email-groups e /api/v1/email-recipients.
const emailGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  memberAccountIds: z.array(z.string()),
  version: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const emailGroupListSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      recipientCount: z.number().int(),
      updatedAt: z.string(),
    }),
  ),
});

const emailRecipientsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      isMember: z.boolean(),
    }),
  ),
});

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new CommunicationUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidEmailGroupDataError(fields);
    }

    case 403:
      return new EmailGroupAccessDeniedError();

    case 404:
      return new EmailGroupNotFoundError();

    case 409: {
      const { detail, fields = [] } = readProblemDetails(data);

      return new EmailGroupConflictError(detail, fields);
    }

    default:
      return new CommunicationUnavailableError(error);
  }
};

const send = async (call: () => Promise<Response>) => {
  try {
    return await call();
  } catch (error) {
    throw toDomainError(error);
  }
};

const request = async <T>(schema: z.ZodType<T>, call: () => Promise<Response>) => {
  const response = await send(call);

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    throw new CommunicationUnavailableError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new CommunicationUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

const groupPath = (id: string) => {
  return `api/v1/email-groups/${encodeURIComponent(id)}`;
};

export const communicationHttpGateway: CommunicationGateway = {
  listEmailGroups: async () => {
    const { items } = await request(emailGroupListSchema, () =>
      bffClient.get('api/v1/email-groups'),
    );

    return items;
  },

  getEmailGroup: (id) => {
    return request(emailGroupSchema, () => bffClient.get(groupPath(id)));
  },

  createEmailGroup: (csrfToken, details) => {
    return request(emailGroupSchema, () =>
      bffClient.post('api/v1/email-groups', { headers: csrfHeaders(csrfToken), json: details }),
    );
  },

  // Substituição completa (nome, descrição e contas).
  updateEmailGroup: (csrfToken, id, version, details) => {
    return request(emailGroupSchema, () =>
      bffClient.put(groupPath(id), {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
      }),
    );
  },

  deleteEmailGroup: async (csrfToken, id) => {
    await send(() => bffClient.delete(groupPath(id), { headers: csrfHeaders(csrfToken) }));
  },

  listEmailRecipients: async () => {
    const { items } = await request(emailRecipientsSchema, () =>
      bffClient.get('api/v1/email-recipients'),
    );

    return items;
  },
};
