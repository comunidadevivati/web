import { listBacklogCardsUseCase } from '@/features/backlog/application/use-cases/list-backlog-cards.use-case';
import { queryOptions } from '@tanstack/react-query';

export const backlogCardsQueryOptions = () => {
  return queryOptions({
    queryKey: ['backlog-cards'],
    queryFn: () => listBacklogCardsUseCase(),
  });
};
