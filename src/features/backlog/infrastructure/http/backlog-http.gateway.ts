import {
  BACKLOG_CARD_STATUSES,
  BACKLOG_CARD_TYPES,
  BacklogAccessDeniedError,
  BacklogCardConflictError,
  BacklogCardNotFoundError,
  BacklogUnavailableError,
  InvalidBacklogCardDataError,
  type BacklogGateway,
} from '@/features/backlog/domain/backlog-card';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

const CARDS_PATH = 'api/v1/backlog-cards';

// Contrato do BFF (ADR 0014): /api/v1/backlog-cards.
const backlogCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(BACKLOG_CARD_TYPES),
  status: z.enum(BACKLOG_CARD_STATUSES),
  version: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
  statusChangedAt: z.string(),
});

const backlogCardListSchema = z.object({ items: z.array(backlogCardSchema) });

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new BacklogUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidBacklogCardDataError(fields);
    }

    case 403:
      return new BacklogAccessDeniedError();

    case 404:
      return new BacklogCardNotFoundError();

    case 409:
      return new BacklogCardConflictError(readProblemDetails(data).detail);

    default:
      return new BacklogUnavailableError(error);
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
    throw new BacklogUnavailableError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new BacklogUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

const cardPath = (id: string) => {
  return `${CARDS_PATH}/${encodeURIComponent(id)}`;
};

export const backlogHttpGateway: BacklogGateway = {
  listCards: async () => {
    const { items } = await request(backlogCardListSchema, () => bffClient.get(CARDS_PATH));

    return items;
  },

  createCard: (csrfToken, details, status) => {
    return request(backlogCardSchema, () =>
      bffClient.post(CARDS_PATH, {
        headers: csrfHeaders(csrfToken),
        json: { ...details, status },
      }),
    );
  },

  updateCard: (csrfToken, id, version, details) => {
    return request(backlogCardSchema, () =>
      bffClient.put(cardPath(id), {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
      }),
    );
  },

  moveCard: (csrfToken, id, version, status) => {
    return request(backlogCardSchema, () =>
      bffClient.put(`${cardPath(id)}/status`, {
        headers: csrfHeaders(csrfToken),
        json: { version, status },
      }),
    );
  },

  deleteCard: async (csrfToken, id) => {
    await send(() => bffClient.delete(cardPath(id), { headers: csrfHeaders(csrfToken) }));
  },
};
