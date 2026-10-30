import {
  formQueryOptions,
  formReportQueryOptions,
} from '@/features/forms/application/queries/forms.query';
import {
  openReportPdfUseCase,
  reportCsvPathUseCase,
} from '@/features/forms/application/use-cases/open-report-file.use-case';
import { scalePointLabel, type QuestionScale } from '@/features/forms/domain/form';
import {
  getOverallRating,
  OVERALL_RATING_MAX,
  type QuestionReport,
} from '@/features/forms/domain/form-report';
import { formatCivilDate, getFormsNotice } from '@/features/forms/presentation/models/forms.model';
import { notify } from '@/shared/feedback/notify';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Valor da escala, com o nome do ponto quando existe ("4 · Bom").
const pointLabelText = (scale: QuestionScale, value: number) => {
  const label = scalePointLabel(scale, value);

  return label ? `${value} · ${label}` : String(value);
};

// Rótulos das pontas ("1 = Ruim · 5 = Ótimo"); vazio com nomes por ponto, que já aparecem nas barras.
const scaleEndsOf = (scale: QuestionScale | null) => {
  if (!scale || scale.pointLabels) {
    return '';
  }

  return [
    scale.minLabel && `${scale.min} = ${scale.minLabel}`,
    scale.maxLabel && `${scale.max} = ${scale.maxLabel}`,
  ]
    .filter(Boolean)
    .join(' · ');
};

const percentOf = (count: number, total: number) => (total === 0 ? 0 : (count / total) * 100);

export type ReportBar = { key: string; label: string; count: number; percent: number };

// Barras de uma pergunta: opções (escolhas) ou valores (escala). A porcentagem é sobre quem respondeu
// a pergunta (na múltipla escolha, a soma passa de 100%).
const barsOf = ({ answeredCount, options, scale }: QuestionReport): ReportBar[] => {
  if (scale) {
    return scale.distribution.map(({ count, value }) => ({
      key: String(value),
      label: pointLabelText(scale, value),
      count,
      percent: percentOf(count, answeredCount),
    }));
  }

  return options.map(({ count, id, label }) => ({
    key: id,
    label,
    count,
    percent: percentOf(count, answeredCount),
  }));
};

export const useFormReportViewModel = () => {
  const { formId } = useParams({
    from: '/_authenticated/departamentos/lideranca/formularios/$formId/relatorio',
  });

  const { i18n, t } = useTranslation('forms');

  const formQuery = useQuery(formQueryOptions(formId));

  const reportQuery = useQuery(formReportQueryOptions(formId));

  // Busca nas respostas de texto, por pergunta.
  const [searches, setSearches] = useState<Record<string, string>>({});

  const report = reportQuery.data;

  const form = formQuery.data;

  const numberFormat = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 });

  const percentFormat = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 });

  const answered = report ? report.digitalCount + report.paperCount : 0;

  // Participação: convidados, quem respondeu (com a taxa), por canal e pendentes.
  const getSummary = () => {
    if (!report) {
      return [];
    }

    const rate = percentFormat.format(percentOf(answered, report.invitedCount));

    return [
      { key: 'invited', label: t('report.summary.invited'), value: String(report.invitedCount) },
      { key: 'answered', label: t('report.summary.answered'), value: `${answered} · ${rate}%` },
      { key: 'digital', label: t('report.summary.digital'), value: String(report.digitalCount) },
      { key: 'paper', label: t('report.summary.paper'), value: String(report.paperCount) },
      { key: 'pending', label: t('report.summary.pending'), value: String(report.pendingCount) },
    ];
  };

  // Nota geral (0 a 5) com uma casa decimal, como nas lojas de aplicativos.
  const getRating = () => {
    const rating = report ? getOverallRating(report.questions) : null;

    if (rating === null) {
      return null;
    }

    const rounded = Math.round(rating * 10) / 10;

    return {
      value: new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(rounded),
      // Preenchimento de cada estrela (0 a 1).
      stars: Array.from({ length: OVERALL_RATING_MAX }, (_, index) =>
        Math.min(Math.max(rounded - index, 0), 1),
      ),
      label: t('report.rating.label', { value: rounded, max: OVERALL_RATING_MAX }),
    };
  };

  const getPeriod = () => {
    if (!form) {
      return '';
    }

    return t('list.period', {
      start: formatCivilDate(form.startsOn, i18n.language),
      end: formatCivilDate(form.endsOn, i18n.language),
    });
  };

  const questions = (report?.questions ?? []).map((question) => {
    const search = (searches[question.questionId] ?? '').trim().toLocaleLowerCase(i18n.language);

    const texts =
      question.fieldType === 'DATE'
        ? question.texts.map((text) => formatCivilDate(text, i18n.language))
        : question.texts;

    return {
      question,
      bars: barsOf(question).map((bar) => ({
        ...bar,
        value: t('report.barValue', {
          count: bar.count,
          percent: percentFormat.format(bar.percent),
        }),
      })),
      average: question.average === null ? null : numberFormat.format(question.average),
      scaleEnds: scaleEndsOf(question.scale),
      // Nome do ponto mais próximo da média, na escala com nomes por ponto.
      averageLabel:
        question.average === null
          ? null
          : scalePointLabel(question.scale, Math.round(question.average)),
      minimum: question.minimum === null ? null : numberFormat.format(question.minimum),
      maximum: question.maximum === null ? null : numberFormat.format(question.maximum),
      texts: search
        ? texts.filter((text) => text.toLocaleLowerCase(i18n.language).includes(search))
        : texts,
      totalTexts: texts.length,
      search: searches[question.questionId] ?? '',
    };
  });

  const getPurgedAt = () => {
    if (!form?.answersPurgedAt) {
      return null;
    }

    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(form.answersPurgedAt));
  };

  const openPdf = () => {
    if (!openReportPdfUseCase(formId)) {
      notify.error({
        title: t('responses.print.blocked.title'),
        description: t('responses.print.blocked.description'),
      });
    }
  };

  return {
    changeSearch: (questionId: string, value: string) =>
      setSearches((current) => ({ ...current, [questionId]: value })),
    csvPath: reportCsvPathUseCase(formId),
    errorNotice: reportQuery.error ? getFormsNotice(reportQuery.error) : null,
    form,
    formId,
    hasAnswers: (report?.digitalCount ?? 0) > 0,
    isAnonymous: report?.anonymous ?? false,
    isLoading: reportQuery.isPending,
    isRetrying: reportQuery.isFetching,
    openPdf,
    paperCount: report?.paperCount ?? 0,
    // Respostas apagadas (LGPD): o relatório fica só com a participação.
    purgedAt: getPurgedAt(),
    period: getPeriod(),
    questions,
    retry: () => void reportQuery.refetch(),
    summary: getSummary(),
    rating: getRating(),
  };
};
