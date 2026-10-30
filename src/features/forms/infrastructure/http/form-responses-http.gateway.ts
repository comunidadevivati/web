import {
  FormAccessDeniedError,
  FormConflictError,
  FormNotFoundError,
  FormsUnavailableError,
  InvalidFormDataError,
} from '@/features/forms/domain/form';
import {
  DELIVERY_STATUSES,
  PAPER_ATTACHMENT_TYPES,
  type FormResponsesGateway,
  type PaperAttachmentTransfer,
} from '@/features/forms/domain/form-response';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contratos do BFF (ADR 0013): /api/v1/forms/:id/invitations.
const invitationSchema = z.object({
  id: z.string(),
  recipientName: z.string(),
  recipientEmail: z.string(),
  status: z.enum(['PENDING', 'ANSWERED']),
  answerChannel: z.enum(['DIGITAL', 'PAPER']).nullable(),
  sentAt: z.string(),
  answeredAt: z.string().nullable(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      text: z.string().nullable(),
      optionIds: z.array(z.string()),
      value: z.number().nullable(),
    }),
  ),
  paperAttachment: z
    .object({ fileName: z.string(), contentType: z.string(), byteSize: z.number().int() })
    .nullable(),
  deliveryStatus: z.enum(DELIVERY_STATUSES).nullable(),
  deliveryUpdatedAt: z.string().nullable(),
});

const ticketSchema = z.object({
  uploadId: z.string(),
  uploadUrl: z.url(),
  contentType: z.enum(PAPER_ATTACHMENT_TYPES),
  expiresAt: z.string(),
});

const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new FormsUnavailableError(error);
  }

  const { data, response } = error;

  const { detail, fields = [] } = readProblemDetails(data);

  switch (response.status) {
    case 400:
      return new InvalidFormDataError(fields);

    case 403:
      return new FormAccessDeniedError();

    case 404:
      return new FormNotFoundError();

    case 409:
      return new FormConflictError(detail);

    default:
      return new FormsUnavailableError(error);
  }
};

const request = async <T>(schema: z.ZodType<T>, call: () => Promise<Response>) => {
  let body: unknown;

  try {
    body = await (await call()).json();
  } catch (error) {
    throw toDomainError(error);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new FormsUnavailableError(parsed.error);
  }

  return parsed.data;
};

const csrfHeaders = (csrfToken: string) => ({ 'X-CSRF-Token': csrfToken });

const invitationsPath = (formId: string) =>
  `api/v1/forms/${encodeURIComponent(formId)}/invitations`;

const invitationPath = (formId: string, invitationId: string, suffix: string) =>
  `${invitationsPath(formId)}/${encodeURIComponent(invitationId)}/${suffix}`;

export const formResponsesHttpGateway: FormResponsesGateway = {
  listInvitations: async (formId) => {
    const { items } = await request(z.object({ items: z.array(invitationSchema) }), () =>
      bffClient.get(invitationsPath(formId)),
    );

    return items;
  },

  markPaperAnswer: (csrfToken, formId, invitationId) => {
    return request(invitationSchema, () =>
      bffClient.put(invitationPath(formId, invitationId, 'paper-answer'), {
        headers: csrfHeaders(csrfToken),
      }),
    );
  },

  unmarkPaperAnswer: (csrfToken, formId, invitationId) => {
    return request(invitationSchema, () =>
      bffClient.delete(invitationPath(formId, invitationId, 'paper-answer'), {
        headers: csrfHeaders(csrfToken),
      }),
    );
  },

  requestPaperAttachmentUpload: (csrfToken, formId, invitationId, contentType) => {
    return request(ticketSchema, () =>
      bffClient.post(invitationPath(formId, invitationId, 'paper-attachment/uploads'), {
        headers: csrfHeaders(csrfToken),
        json: { contentType },
      }),
    );
  },

  completePaperAttachmentUpload: (csrfToken, formId, invitationId, upload) => {
    return request(invitationSchema, () =>
      bffClient.put(invitationPath(formId, invitationId, 'paper-attachment'), {
        headers: csrfHeaders(csrfToken),
        json: upload,
      }),
    );
  },

  getPaperAttachmentUrl: async (formId, invitationId) => {
    const { url } = await request(z.object({ url: z.url() }), () =>
      bffClient.get(invitationPath(formId, invitationId, 'paper-attachment')),
    );

    return url;
  },
};

// Envio direto do navegador ao bucket de mídia pela URL pré-assinada (sem cookies).
export const directPaperAttachmentTransfer: PaperAttachmentTransfer = {
  send: async ({ contentType, uploadUrl }, file) => {
    let response: Response;

    try {
      response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
        credentials: 'omit',
      });
    } catch (error) {
      throw new FormsUnavailableError(error);
    }

    if (!response.ok) {
      throw new FormsUnavailableError(new Error(`Upload failed with status ${response.status}`));
    }
  },
};
