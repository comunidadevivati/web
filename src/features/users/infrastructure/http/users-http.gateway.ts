import {
  InvalidUserDataError,
  UserConflictError,
  UserEmailTakenError,
  UserNotFoundError,
  UsersAccessDeniedError,
  UsersServiceUnavailableError,
  type UsersGateway,
} from '@/features/users/domain/user';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contrato de /api/v1/users no BFF.
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  emailVerified: z.boolean(),
  createdAt: z.string(),
  suspendedAt: z.string().nullable(),
  personId: z.string().nullable(),
});

const userPageSchema = z.object({
  items: z.array(userSchema),
  nextCursor: z.string().nullable(),
});

// Corpo de erro do BFF: mensagem legível, campos recusados (400) e código estável do conflito
// (409: email_taken, self_action, verified_account).
const errorBodySchema = z.object({
  message: z.string().trim().min(1).max(300).optional().catch(undefined),
  fields: z.array(z.string()).optional().catch(undefined),
  code: z.string().optional().catch(undefined),
});

const readErrorBody = (data: unknown) => {
  const parsed = errorBodySchema.safeParse(data);

  return parsed.success ? parsed.data : {};
};

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
// O corpo do erro vem em error.data: o Ky 2 já o consumiu ao criar o HTTPError.
const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new UsersServiceUnavailableError(error);
  }

  const { code, fields = [], message } = readErrorBody(error.data);

  switch (error.response.status) {
    case 400:
      return new InvalidUserDataError(fields, message);

    case 403:
      return new UsersAccessDeniedError(message);

    case 404:
      return new UserNotFoundError(message);

    case 409:
      return code === 'email_taken'
        ? new UserEmailTakenError(message)
        : new UserConflictError(message);

    default:
      return new UsersServiceUnavailableError(error);
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
  const parsed = schema.safeParse(await (await send(call)).json());

  if (!parsed.success) {
    throw new UsersServiceUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

const userPath = (id: string) => {
  return `api/v1/users/${encodeURIComponent(id)}`;
};

export const usersHttpGateway: UsersGateway = {
  listUsers: ({ cursor, emailVerified, hasPerson, search, status }) => {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries({ cursor, search, status })) {
      if (value) {
        searchParams.set(key, value);
      }
    }

    if (emailVerified !== null) {
      searchParams.set('emailVerified', String(emailVerified));
    }

    if (hasPerson !== null) {
      searchParams.set('hasPerson', String(hasPerson));
    }

    return request(userPageSchema, () => bffClient.get('api/v1/users', { searchParams }));
  },

  // Mesmo contrato do cadastro público: { name, phone, email, password }.
  createUser: (csrfToken, { email, fullName, password, phone }) => {
    return request(userSchema, () =>
      bffClient.post('api/v1/users', {
        headers: csrfHeaders(csrfToken),
        json: { name: fullName, phone, email, password },
      }),
    );
  },

  updateUser: (csrfToken, id, { email, fullName, phone }) => {
    return request(userSchema, () =>
      bffClient.patch(userPath(id), {
        headers: csrfHeaders(csrfToken),
        json: { name: fullName, phone, email },
      }),
    );
  },

  suspendUser: (csrfToken, id) => {
    return request(userSchema, () =>
      bffClient.post(`${userPath(id)}/suspend`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  reactivateUser: (csrfToken, id) => {
    return request(userSchema, () =>
      bffClient.post(`${userPath(id)}/reactivate`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  deleteUser: async (csrfToken, id) => {
    await send(() => bffClient.delete(userPath(id), { headers: csrfHeaders(csrfToken) }));
  },
};
