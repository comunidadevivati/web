import { backlogCardsQueryOptions } from '@/features/backlog/application/queries/backlog.query';
import { summarizeBacklogCards } from '@/features/backlog/domain/backlog-card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useTechnologyDashboardViewModel = () => {
  const { t } = useTranslation('departments');

  const { data: cards, isPending } = useQuery(backlogCardsQueryOptions());

  // O card abre o quadro mesmo sem o resumo (falha ou carregando); os números só aparecem com ele.
  const summary = cards ? summarizeBacklogCards(cards) : null;

  const requestsCard = {
    total: summary ? String(summary.total) : null,
    details: summary ? t('technology.cards.requests.details', summary) : null,
    isLoading: isPending,
  };

  return { requestsCard };
};
