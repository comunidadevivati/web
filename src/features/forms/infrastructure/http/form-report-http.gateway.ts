import {
  FormAccessDeniedError,
  FormNotFoundError,
  FormsUnavailableError,
  QUESTION_FIELD_TYPES,
} from '@/features/forms/domain/form';
import type { FormReportGateway } from '@/features/forms/domain/form-report';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contrato do BFF (ADR 0013): /api/v1/forms/:id/report (e report.csv / report.pdf).
const reportSchema = z.object({
  anonymous: z.boolean(),
  invitedCount: z.number().int(),
  digitalCount: z.number().int(),
  paperCount: z.number().int(),
  pendingCount: z.number().int(),
  questions: z.array(
    z.object({
      questionId: z.string(),
      title: z.string(),
      fieldType: z.enum(QUESTION_FIELD_TYPES),
      answeredCount: z.number().int(),
      options: z.array(z.object({ id: z.string(), label: z.string(), count: z.number().int() })),
      scale: z
        .object({
          min: z.number().int(),
          max: z.number().int(),
          minLabel: z.string().nullable(),
          maxLabel: z.string().nullable(),
          pointLabels: z.array(z.string()).nullable(),
          distribution: z.array(z.object({ value: z.number().int(), count: z.number().int() })),
        })
        .nullable(),
      average: z.number().nullable(),
      minimum: z.number().nullable(),
      maximum: z.number().nullable(),
      texts: z.array(z.string()),
    }),
  ),
});

const formPath = (formId: string) => `/api/v1/forms/${encodeURIComponent(formId)}`;

export const formReportHttpGateway: FormReportGateway = {
  getReport: async (formId) => {
    let body: unknown;

    try {
      body = await bffClient.get(`${formPath(formId).slice(1)}/report`).json();
    } catch (error) {
      if (isHTTPError(error) && error.response.status === 404) {
        throw new FormNotFoundError();
      }

      if (isHTTPError(error) && error.response.status === 403) {
        throw new FormAccessDeniedError();
      }

      throw new FormsUnavailableError(error);
    }

    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      throw new FormsUnavailableError(parsed.error);
    }

    return parsed.data;
  },

  csvPath: (formId) => `${formPath(formId)}/report.csv`,

  pdfPath: (formId) => `${formPath(formId)}/report.pdf`,
};
