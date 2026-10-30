import { FormsUnavailableError, QUESTION_FIELD_TYPES } from '@/features/forms/domain/form';
import {
  AnswerConflictError,
  InvalidAnswersError,
  InvitationNotFoundError,
  type FormAnswersGateway,
} from '@/features/forms/domain/form-answer';
import { bffClient } from '@/shared/http/bff-client';
import { readProblemDetails } from '@/shared/http/problem-details';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Rotas públicas do BFF (ADR 0013): o token vai no corpo, nunca na URL da requisição.
const answerSchema = z.object({
  questionId: z.string(),
  text: z.string().nullable(),
  optionIds: z.array(z.string()),
  value: z.number().nullable(),
});

const invitationSchema = z.object({
  recipient: z.object({ name: z.string(), email: z.string() }),
  status: z.enum(['PENDING', 'ANSWERED']),
  answerChannel: z.enum(['DIGITAL', 'PAPER']).nullable(),
  answeredAt: z.string().nullable(),
  answers: z.array(answerSchema),
  availability: z.enum(['OPEN', 'NOT_STARTED', 'ENDED', 'CLOSED']),
  form: z.object({
    title: z.string(),
    description: z.string().nullable(),
    startsOn: z.string(),
    endsOn: z.string(),
    headerImage: z
      .object({ url: z.string(), width: z.number().int(), height: z.number().int() })
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
    anonymous: z.boolean(),
    allowAnswerEdit: z.boolean(),
    consentText: z.string().nullable(),
  }),
});

const toDomainError = (error: unknown) => {
  if (!isHTTPError(error)) {
    return new FormsUnavailableError(error);
  }

  const { data, response } = error;

  switch (response.status) {
    case 400: {
      const { fields = [] } = readProblemDetails(data);

      return new InvalidAnswersError(fields);
    }

    case 404:
      return new InvitationNotFoundError();

    case 409: {
      const { detail } = readProblemDetails(data);

      return new AnswerConflictError(detail);
    }

    default:
      return new FormsUnavailableError(error);
  }
};

const post = async (path: string, json: unknown) => {
  let body: unknown;

  try {
    body = await bffClient.post(path, { json }).json();
  } catch (error) {
    throw toDomainError(error);
  }

  const parsed = invitationSchema.safeParse(body);

  if (!parsed.success) {
    throw new FormsUnavailableError(parsed.error);
  }

  return parsed.data;
};

export const formAnswersHttpGateway: FormAnswersGateway = {
  lookup: (token) => post('api/v1/public/form-invitations/lookup', { token }),

  submit: (token, answers, consentAccepted, sendCopy) =>
    post('api/v1/public/form-invitations/answers', { token, answers, consentAccepted, sendCopy }),
};
