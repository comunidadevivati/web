import {
  InvalidOrganizationDataError,
  OrganizationAccessDeniedError,
  OrganizationConflictError,
  OrganizationNotFoundError,
  OrganizationServiceUnavailableError,
  type OrganizationGateway,
} from '@/features/organization/domain/organization';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos de /api/v1/organization e /api/v1/congregations no BFF (repassados da Core API).
const addressSchema = z.object({
  street: z.string(),
  number: z.string(),
  complement: z.string().nullable(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
});

const organizationSchema = z.object({
  id: z.string(),
  legalName: z.string(),
  tradeName: z.string(),
  cnpj: z.string(),
  address: addressSchema,
  phone: z.string(),
  email: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  version: z.number().int(),
});

const congregationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  code: z.string(),
  name: z.string(),
  cnpj: z.string().nullable(),
  address: addressSchema,
  phone: z.string().nullable(),
  email: z.string().nullable(),
  headquarters: z.boolean(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']),
  version: z.number().int(),
});

const congregationPageSchema = z.object({
  items: z.array(congregationSchema),
  nextCursor: z.string().nullable(),
});

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
// O corpo do erro vem em error.data: o Ky 2 já o consumiu ao criar o HTTPError.
const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new OrganizationServiceUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidOrganizationDataError(fields);
    }

    case 403:
      return new OrganizationAccessDeniedError();

    case 404:
      return new OrganizationNotFoundError();

    case 409: {
      const { detail } = readProblemDetails(data);

      return new OrganizationConflictError(detail);
    }

    default:
      return new OrganizationServiceUnavailableError(error);
  }
};

const request = async <T>(schema: z.ZodType<T>, send: () => Promise<Response>) => {
  let body: unknown;

  try {
    body = await (await send()).json();
  } catch (error) {
    throw toDomainError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new OrganizationServiceUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

export const organizationHttpGateway: OrganizationGateway = {
  getOrganization: () => {
    return request(organizationSchema, () => bffClient.get('api/v1/organization'));
  },

  updateOrganization: (csrfToken, version, details) => {
    return request(organizationSchema, () =>
      bffClient.patch('api/v1/organization', {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
      }),
    );
  },

  changeOrganizationStatus: (csrfToken, action) => {
    return request(organizationSchema, () =>
      bffClient.post(`api/v1/organization/${action}`, {
        headers: csrfHeaders(csrfToken),
      }),
    );
  },

  listCongregations: ({ cursor, limit, status }) => {
    const searchParams = new URLSearchParams();

    if (limit) {
      searchParams.set('limit', String(limit));
    }

    if (status) {
      searchParams.set('status', status);
    }

    if (cursor) {
      searchParams.set('cursor', cursor);
    }

    return request(congregationPageSchema, () =>
      bffClient.get('api/v1/congregations', { searchParams }),
    );
  },

  registerCongregation: (csrfToken, registration) => {
    return request(congregationSchema, () =>
      bffClient.post('api/v1/congregations', {
        headers: csrfHeaders(csrfToken),
        json: registration,
      }),
    );
  },

  updateCongregation: (csrfToken, id, version, details) => {
    return request(congregationSchema, () =>
      bffClient.patch(`api/v1/congregations/${encodeURIComponent(id)}`, {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
      }),
    );
  },

  changeCongregationStatus: (csrfToken, id, action) => {
    return request(congregationSchema, () =>
      bffClient.post(`api/v1/congregations/${encodeURIComponent(id)}/${action}`, {
        headers: csrfHeaders(csrfToken),
      }),
    );
  },
};
