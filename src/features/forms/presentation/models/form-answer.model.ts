import type { FormQuestion } from '@/features/forms/domain/form';
import {
  ANSWER_TOKEN_PATTERN,
  AnswerConflictError,
  INPUT_ANSWER_MAX_LENGTH,
  InvalidAnswersError,
  InvitationNotFoundError,
  TEXTAREA_ANSWER_MAX_LENGTH,
  type FormAnswer,
  type FormInvitation,
} from '@/features/forms/domain/form-answer';
import type { AnswerDraftValue } from '@/features/forms/presentation/components/question-answer-field';
import { z } from 'zod';

// Token fora do formato é tratado como link ausente (sem chamar o servidor).
export const formAnswerSearchSchema = z
  .object({ token: z.string().optional() })
  .transform(({ token }) => ({
    token: token && ANSWER_TOKEN_PATTERN.test(token) ? token : undefined,
  }));

// Falhas da página de resposta.
export type FormAnswerNotice = 'invalidLink' | 'invalidAnswers' | 'conflict' | 'unavailable';

export const getFormAnswerNotice = (error: Error): FormAnswerNotice => {
  if (error instanceof InvitationNotFoundError) {
    return 'invalidLink';
  }

  if (error instanceof InvalidAnswersError) {
    return 'invalidAnswers';
  }

  if (error instanceof AnswerConflictError) {
    return 'conflict';
  }

  return 'unavailable';
};

// Rascunho por pergunta (chave = ID da pergunta).
export type AnswerDraft = Record<string, AnswerDraftValue>;

export type FormAnswerInput = { answers: AnswerDraft; consentAccepted: boolean; sendCopy: boolean };

export const formAnswerMessages = {
  tooLong: 'answer.validation.tooLong',
  empty: 'answer.validation.empty',
  required: 'answer.validation.required',
  invalidNumber: 'answer.validation.invalidNumber',
  invalidDate: 'answer.validation.invalidDate',
  consent: 'answer.validation.consent',
} as const;

const NUMBER_PATTERN = /^-?\d+([.,]\d+)?$/u;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

const isAnswered = (question: FormQuestion, answer: AnswerDraftValue | undefined) => {
  if (!answer) {
    return false;
  }

  if (question.fieldType === 'SCALE') {
    return answer.value !== null;
  }

  return answer.optionIds.length > 0 || answer.text.trim() !== '';
};

// Problema da resposta de uma pergunta (mensagem), ou null.
const issueOf = (question: FormQuestion, answer: AnswerDraftValue | undefined) => {
  const text = answer?.text.trim() ?? '';

  if (question.required && !isAnswered(question, answer)) {
    return formAnswerMessages.required;
  }

  if (question.fieldType === 'NUMBER' && text !== '' && !NUMBER_PATTERN.test(text)) {
    return formAnswerMessages.invalidNumber;
  }

  if (question.fieldType === 'DATE' && text !== '' && !DATE_PATTERN.test(text)) {
    return formAnswerMessages.invalidDate;
  }

  const max =
    question.fieldType === 'TEXTAREA' ? TEXTAREA_ANSWER_MAX_LENGTH : INPUT_ANSWER_MAX_LENGTH;

  return text.length > max ? formAnswerMessages.tooLong : null;
};

// Obrigatórias respondidas, números e datas válidos, textos no limite e, sem obrigatórias, ao menos
// uma resposta. Com texto de consentimento, o aceite é obrigatório.
export const createFormAnswerSchema = (
  questions: readonly FormQuestion[],
  requiresConsent: boolean,
) => {
  return z
    .object({
      answers: z.record(
        z.string(),
        z.object({
          text: z.string(),
          optionIds: z.array(z.string()),
          value: z.number().nullable(),
        }),
      ),
      consentAccepted: z.boolean(),
      sendCopy: z.boolean(),
    })
    .superRefine(({ answers, consentAccepted }, context) => {
      questions.forEach((question) => {
        const issue = issueOf(question, answers[question.id]);

        if (issue) {
          context.addIssue({ code: 'custom', message: issue, path: ['answers', question.id] });
        }
      });

      if (!questions.some((question) => isAnswered(question, answers[question.id]))) {
        context.addIssue({ code: 'custom', message: formAnswerMessages.empty, path: ['answers'] });
      }

      if (requiresConsent && !consentAccepted) {
        context.addIssue({
          code: 'custom',
          message: formAnswerMessages.consent,
          path: ['consentAccepted'],
        });
      }
    });
};

export const toAnswerDraft = (
  questions: readonly FormQuestion[],
  answers: readonly FormAnswer[],
): AnswerDraft => {
  const byQuestion = new Map(answers.map((answer) => [answer.questionId, answer]));

  return Object.fromEntries(
    questions.map(({ fieldType, id }) => {
      const answer = byQuestion.get(id);

      // Número volta ao campo de texto; escala fica no valor.
      const text =
        fieldType === 'NUMBER' && answer?.value !== null && answer?.value !== undefined
          ? String(answer.value)
          : (answer?.text ?? '');

      return [
        id,
        {
          text,
          optionIds: answer?.optionIds ?? [],
          value: fieldType === 'SCALE' ? (answer?.value ?? null) : null,
        },
      ];
    }),
  );
};

// Somente as perguntas respondidas, no formato do contrato.
export const toAnswers = (questions: readonly FormQuestion[], draft: AnswerDraft): FormAnswer[] => {
  return questions.flatMap(({ fieldType, id }): FormAnswer[] => {
    const answer = draft[id];

    if (!answer) {
      return [];
    }

    const text = answer.text.trim();

    switch (fieldType) {
      case 'CHECKBOX':

      case 'RADIO':

      case 'SELECT':
        return answer.optionIds.length === 0
          ? []
          : [{ questionId: id, text: null, optionIds: answer.optionIds, value: null }];

      case 'SCALE':
        return answer.value === null
          ? []
          : [{ questionId: id, text: null, optionIds: [], value: answer.value }];

      case 'NUMBER':
        return text === ''
          ? []
          : [{ questionId: id, text: null, optionIds: [], value: Number(text.replace(',', '.')) }];

      default:
        return text === '' ? [] : [{ questionId: id, text, optionIds: [], value: null }];
    }
  });
};

// Pode enviar: pendente, ou já respondido pelo link com edição permitida (nunca anônimo), sempre com
// o formulário aberto.
export const canSubmitAnswers = ({ answerChannel, availability, form, status }: FormInvitation) => {
  if (availability !== 'OPEN') {
    return false;
  }

  return (
    status === 'PENDING' || (answerChannel === 'DIGITAL' && form.allowAnswerEdit && !form.anonymous)
  );
};
