import type { QuestionFieldType, QuestionScale } from '@/features/forms/domain/form';

// Relatório consolidado de um formulário (ADR 0013 do backend). Respostas em papel contam na
// participação, mas o conteúdo delas está nos anexos e não entra nas contagens das perguntas.

export type QuestionReport = {
  questionId: string;
  title: string;
  fieldType: QuestionFieldType;
  answeredCount: number;
  options: { id: string; label: string; count: number }[];
  scale: (QuestionScale & { distribution: { value: number; count: number }[] }) | null;
  average: number | null;
  minimum: number | null;
  maximum: number | null;
  // Respostas de texto e datas (AAAA-MM-DD), em ordem alfabética.
  texts: string[];
};

export type FormReport = {
  anonymous: boolean;
  invitedCount: number;
  digitalCount: number;
  paperCount: number;
  pendingCount: number;
  questions: QuestionReport[];
};

// Nota máxima da nota geral (estrelas).
export const OVERALL_RATING_MAX = 5;

// Nota geral: média de todas as respostas das perguntas de escala, cada uma convertida para 0 a 5
// (valor / máximo da escala × 5; numa escala de 1 a 5, a própria nota). null sem respostas de escala.
export const getOverallRating = (questions: readonly QuestionReport[]): number | null => {
  let total = 0;

  let count = 0;

  questions.forEach(({ fieldType, scale }) => {
    if (fieldType !== 'SCALE' || !scale || scale.max <= 0) {
      return;
    }

    scale.distribution.forEach(({ count: answers, value }) => {
      total += answers * (value / scale.max) * OVERALL_RATING_MAX;

      count += answers;
    });
  });

  return count === 0 ? null : total / count;
};

export interface FormReportGateway {
  getReport: (formId: string) => Promise<FormReport>;
  // Rotas de arquivo do BFF (mesma origem do front): CSV baixado e PDF aberto numa nova aba.
  csvPath: (formId: string) => string;
  pdfPath: (formId: string) => string;
}
