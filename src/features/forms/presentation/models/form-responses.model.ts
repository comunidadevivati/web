import type { StatusBadgeTone } from '@/components/molecules';
import {
  scalePointLabel,
  type FormQuestion,
  type QuestionFieldType,
  type QuestionScale,
} from '@/features/forms/domain/form';
import type { FormAnswer } from '@/features/forms/domain/form-answer';
import {
  PAPER_ATTACHMENT_EXTENSIONS,
  PAPER_ATTACHMENT_TYPES,
  type FormInvitationRecord,
} from '@/features/forms/domain/form-response';

// Atributo accept do seletor do anexo da resposta em papel.
export const PAPER_ATTACHMENT_ACCEPT = [
  ...PAPER_ATTACHMENT_TYPES,
  ...PAPER_ATTACHMENT_EXTENSIONS,
].join(',');

// Situação do convite na lista: pendente, respondido pelo link ou em papel.
export type InvitationState = 'PENDING' | 'DIGITAL' | 'PAPER';

export const getInvitationState = ({
  answerChannel,
  status,
}: Pick<FormInvitationRecord, 'status' | 'answerChannel'>): InvitationState => {
  if (status === 'PENDING') {
    return 'PENDING';
  }

  return answerChannel === 'PAPER' ? 'PAPER' : 'DIGITAL';
};

export const invitationStateTones: Record<InvitationState, StatusBadgeTone> = {
  PENDING: 'warning',
  DIGITAL: 'success',
  PAPER: 'success',
};

// Resposta de uma pergunta pronta para exibir ou imprimir: texto ou rótulos das opções marcadas.
export type AnswerRow = {
  questionId: string;
  title: string;
  fieldType: QuestionFieldType;
  text: string | null;
  optionLabels: string[];
};

// Escala e número: o valor, com o nome do ponto quando a escala tem ("4 · Bom").
const valueText = (scale: QuestionScale | null, value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return null;
  }

  const label = scalePointLabel(scale, value);

  return label ? `${value} · ${label}` : String(value);
};

export const toAnswerRows = (
  questions: readonly FormQuestion[],
  answers: readonly FormAnswer[],
): AnswerRow[] => {
  const byQuestion = new Map(answers.map((answer) => [answer.questionId, answer]));

  return questions.map(({ fieldType, id, options, scale, title }) => {
    const answer = byQuestion.get(id);

    const selected = new Set(answer?.optionIds ?? []);

    return {
      questionId: id,
      title,
      fieldType,
      // Escala e número chegam em value; data em texto AAAA-MM-DD.
      text: answer?.text ?? valueText(scale, answer?.value),
      optionLabels: options.filter((option) => selected.has(option.id)).map(({ label }) => label),
    };
  });
};
