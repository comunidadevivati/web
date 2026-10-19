import {
  InvalidMemberDataError,
  MemberAccessDeniedError,
  MemberConflictError,
  MemberNotFoundError,
  MembersServiceUnavailableError,
  type MembersGateway,
} from '@/features/members/domain/member';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos de /api/v1/members e /api/v1/memberships no BFF (repassados da Core API).
const memberSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  birthDate: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
  version: z.number().int(),
});

const memberPageSchema = z.object({
  items: z.array(memberSchema),
  nextCursor: z.string().nullable(),
});

const membershipSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  congregationId: z.string(),
  primary: z.boolean(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']),
  startedOn: z.string().nullable(),
  endedOn: z.string().nullable(),
  version: z.number().int(),
  congregation: z.object({ code: z.string(), name: z.string() }).nullable(),
});

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
const toDomainError = async (error: unknown) => {
  if (!isHTTPError(error)) {
    return new MembersServiceUnavailableError(error);
  }

  const { response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = await readProblemDetails(response);

      return new InvalidMemberDataError(fields);
    }

    case 403:
      return new MemberAccessDeniedError();

    case 404:
      return new MemberNotFoundError();

    case 409: {
      const { detail } = await readProblemDetails(response);

      return new MemberConflictError(detail);
    }

    default:
      return new MembersServiceUnavailableError(error);
  }
};

const request = async <T>(schema: z.ZodType<T>, send: () => Promise<Response>) => {
  let body: unknown;

  try {
    body = await (await send()).json();
  } catch (error) {
    throw await toDomainError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new MembersServiceUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

const memberPath = (id: string) => {
  return `api/v1/members/${encodeURIComponent(id)}`;
};

export const membersHttpGateway: MembersGateway = {
  listMembers: ({ congregationId, cursor, search, status }) => {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries({ congregationId, cursor, search, status })) {
      if (value) {
        searchParams.set(key, value);
      }
    }

    return request(memberPageSchema, () => bffClient.get('api/v1/members', { searchParams }));
  },

  getMember: (id) => {
    return request(memberSchema, () => bffClient.get(memberPath(id)));
  },

  registerMember: (csrfToken, profile) => {
    return request(memberSchema, () =>
      bffClient.post('api/v1/members', { headers: csrfHeaders(csrfToken), json: profile }),
    );
  },

  updateMember: (csrfToken, id, version, profile) => {
    return request(memberSchema, () =>
      bffClient.patch(memberPath(id), {
        headers: csrfHeaders(csrfToken),
        json: { version, ...profile },
      }),
    );
  },

  changeMemberStatus: (csrfToken, id, action) => {
    return request(memberSchema, () =>
      bffClient.post(`${memberPath(id)}/${action}`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  listMemberships: (memberId) => {
    return request(z.array(membershipSchema), () =>
      bffClient.get(`${memberPath(memberId)}/memberships`),
    );
  },

  registerMembership: (csrfToken, memberId, registration) => {
    return request(membershipSchema, () =>
      bffClient.post(`${memberPath(memberId)}/memberships`, {
        headers: csrfHeaders(csrfToken),
        json: registration,
      }),
    );
  },

  changeMembershipStatus: (csrfToken, id, action) => {
    return request(membershipSchema, () =>
      bffClient.post(`api/v1/memberships/${encodeURIComponent(id)}/${action}`, {
        headers: csrfHeaders(csrfToken),
      }),
    );
  },
};
