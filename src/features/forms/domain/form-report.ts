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

// Nota geral: média de todas as respostas das perguntas de escala, cada uma convertida para 0 a 5 pela
// posição na escala ((valor − início) / (fim − início) × 5): a primeira opção vale sempre 0 e a última
// sempre 5, qualquer que seja o tamanho da escala. null sem respostas de escala.
export const getOverallRating = (questions: readonly QuestionReport[]): number | null => {
  let total = 0;

  let count = 0;

  questions.forEach(({ fieldType, scale }) => {
    if (fieldType !== 'SCALE' || !scale || scale.max <= scale.min) {
      return;
    }

    const range = scale.max - scale.min;

    scale.distribution.forEach(({ count: answers, value }) => {
      total += answers * ((value - scale.min) / range) * OVERALL_RATING_MAX;

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
