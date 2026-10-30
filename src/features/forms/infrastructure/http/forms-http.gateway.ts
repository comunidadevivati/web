import {
  ACCEPTED_HEADER_IMAGE_TYPES,
  EMAIL_DISPATCH_STATUSES,
  FORM_STATUSES,
  FormAccessDeniedError,
  FormConflictError,
  FormNotFoundError,
  FormsUnavailableError,
  InvalidFormDataError,
  QUESTION_FIELD_TYPES,
  type FormsGateway,
} from '@/features/forms/domain/form';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos do BFF (ADR 0013): /api/v1/departments/:department/forms, /api/v1/forms e
// /api/v1/email-groups.
const formSchema = z.object({
  id: z.string(),
  department: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startsOn: z.string(),
  endsOn: z.string(),
  status: z.enum(FORM_STATUSES),
  headerImage: z
    .object({
      url: z.string(),
      width: z.number().int(),
      height: z.number().int(),
      contentType: z.string(),
      byteSize: z.number().int(),
    })
    .nullable(),
  questions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      fieldType: z.enum(QUESTION_FIELD_TYPES),
      required: z.boolean(),
      options: z.array(z.object({ id: z.string(), label: z.string() })),
      scale: z
        .object({
          min: z.number().int(),
          max: z.number().int(),
          minLabel: z.string().nullable(),
          maxLabel: z.string().nullable(),
          pointLabels: z.array(z.string()).nullable(),
        })
        .nullable(),
    }),
  ),
  recipientGroupIds: z.array(z.string()),
  anonymous: z.boolean(),
  allowAnswerEdit: z.boolean(),
  consentText: z.string().nullable(),
  emailDispatch: z
    .object({
      kind: z.enum(['INVITE', 'REMINDER']),
      status: z.enum(EMAIL_DISPATCH_STATUSES),
      startedAt: z.string(),
      finishedAt: z.string().nullable(),
      sentCount: z.number().int(),
      failedCount: z.number().int(),
    })
    .nullable(),
  invitedCount: z.number().int(),
  answeredCount: z.number().int(),
  pendingRecipientCount: z.number().int(),
  answersPurgedAt: z.string().nullable(),
  version: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const formPageSchema = z.object({
  items: z.array(formSchema),
  nextCursor: z.string().nullable(),
});

const formsSummarySchema = z.object({
  total: z.number().int(),
  byStatus: z.object({
    DRAFT: z.number().int(),
    PUBLISHED: z.number().int(),
    FINISHED: z.number().int(),
    CANCELLED: z.number().int(),
  }),
});

const uploadTicketSchema = z.object({
  uploadId: z.string(),
  uploadUrl: z.url(),
  contentType: z.enum(ACCEPTED_HEADER_IMAGE_TYPES),
  expiresAt: z.string(),
});

const emailGroupsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      recipientCount: z.number().int(),
    }),
  ),
});

// Normaliza as falhas do BFF em erros do domínio. O 401 (sessão expirada) já é tratado pelo
// bffClient, que leva ao login; aqui ele vira apenas indisponibilidade.
const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new FormsUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidFormDataError(fields);
    }

    case 403:
      return new FormAccessDeniedError();

    case 404:
      return new FormNotFoundError();

    case 409: {
      const { detail } = readProblemDetails(data);

      return new FormConflictError(detail);
    }

    default:
      return new FormsUnavailableError(error);
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
    throw new FormsUnavailableError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new FormsUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({
  'X-CSRF-Token': csrfToken,
});

const departmentFormsPath = (department: string) => {
  return `api/v1/departments/${encodeURIComponent(department)}/forms`;
};

const formPath = (id: string) => {
  return `api/v1/forms/${encodeURIComponent(id)}`;
};

export const formsHttpGateway: FormsGateway = {
  listForms: (department, status, cursor, limit) => {
    const searchParams = new URLSearchParams();

    if (status) {
      searchParams.set('status', status);
    }

    if (cursor) {
      searchParams.set('cursor', cursor);
    }

    if (limit) {
      searchParams.set('limit', String(limit));
    }

    return request(formPageSchema, () =>
      bffClient.get(departmentFormsPath(department), { searchParams }),
    );
  },

  getFormsSummary: (department) => {
    return request(formsSummarySchema, () =>
      bffClient.get(`${departmentFormsPath(department)}/summary`),
    );
  },

  getForm: (id) => {
    return request(formSchema, () => bffClient.get(formPath(id)));
  },

  createForm: (csrfToken, department, details) => {
    return request(formSchema, () =>
      bffClient.post(departmentFormsPath(department), {
        headers: csrfHeaders(csrfToken),
        json: details,
      }),
    );
  },

  updateForm: (csrfToken, id, version, details) => {
    return request(formSchema, () =>
      bffClient.patch(formPath(id), {
        headers: csrfHeaders(csrfToken),
        json: { version, ...details },
      }),
    );
  },

  // Só o status, sem reenviar o conteúdo; aplica as mesmas regras de transição e publicação.
  changeFormStatus: (csrfToken, id, version, status) => {
    return request(formSchema, () =>
      bffClient.put(`${formPath(id)}/status`, {
        headers: csrfHeaders(csrfToken),
        json: { version, status },
      }),
    );
  },

  // 202: o envio continua no servidor; o painel acompanha pelo emailDispatch do formulário.
  startEmailDispatch: (csrfToken, id, options) => {
    return request(formSchema, () =>
      bffClient.post(`${formPath(id)}/email-dispatches`, {
        headers: csrfHeaders(csrfToken),
        json: options,
      }),
    );
  },

  purgeAnswers: (csrfToken, id) => {
    return request(formSchema, () =>
      bffClient.delete(`${formPath(id)}/answers`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  duplicateForm: (csrfToken, id) => {
    return request(formSchema, () =>
      bffClient.post(`${formPath(id)}/duplicates`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  deleteForm: async (csrfToken, id) => {
    await send(() => bffClient.delete(formPath(id), { headers: csrfHeaders(csrfToken) }));
  },

  requestHeaderImageUpload: (csrfToken, id, contentType) => {
    return request(uploadTicketSchema, () =>
      bffClient.post(`${formPath(id)}/header-image/uploads`, {
        headers: csrfHeaders(csrfToken),
        json: { contentType },
      }),
    );
  },

  // O PUT direto ao bucket terminou: a Core API valida o conteúdo e grava a imagem.
  completeHeaderImageUpload: (csrfToken, id, uploadId) => {
    return request(formSchema, () =>
      bffClient.put(`${formPath(id)}/header-image`, {
        headers: csrfHeaders(csrfToken),
        json: { uploadId },
      }),
    );
  },

  removeHeaderImage: (csrfToken, id) => {
    return request(formSchema, () =>
      bffClient.delete(`${formPath(id)}/header-image`, { headers: csrfHeaders(csrfToken) }),
    );
  },

  listEmailGroups: async () => {
    const { items } = await request(emailGroupsSchema, () => bffClient.get('api/v1/email-groups'));

    return items;
  },
};
