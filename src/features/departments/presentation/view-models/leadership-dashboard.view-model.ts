import { LEADERSHIP_DEPARTMENT } from '@/features/departments/domain/department';
import { formsSummaryQueryOptions } from '@/features/forms/application/queries/forms.query';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useLeadershipDashboardViewModel = () => {
  const { t } = useTranslation('departments');

  const { data: summary, isPending } = useQuery(formsSummaryQueryOptions(LEADERSHIP_DEPARTMENT));

  // O card abre a lista mesmo sem o resumo (falha ou carregando); os números só aparecem com ele.
  const getDetails = () => {
    if (!summary) {
      return null;
    }

    const {
      byStatus: { DRAFT: draft, PUBLISHED: published },
    } = summary;

    return t('leadership.cards.forms.details', { published, draft });
  };

  const formsCard = {
    total: summary ? String(summary.total) : null,
    details: getDetails(),
    isLoading: isPending,
  };

  return { formsCard };
};
