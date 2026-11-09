import type { BacklogGateway } from '@/features/backlog/domain/backlog-card';
import { backlogHttpGateway } from '@/features/backlog/infrastructure/http/backlog-http.gateway';

export const listBacklogCardsUseCase = (gateway: BacklogGateway = backlogHttpGateway) => {
  return gateway.listCards();
};
