import type { BacklogGateway } from '@/features/backlog/domain/backlog-card';
import { backlogHttpGateway } from '@/features/backlog/infrastructure/http/backlog-http.gateway';

type DeleteBacklogCardCommand = {
  csrfToken: string;
  id: string;
};

export const deleteBacklogCardUseCase = (
  { csrfToken, id }: DeleteBacklogCardCommand,
  gateway: BacklogGateway = backlogHttpGateway,
) => {
  return gateway.deleteCard(csrfToken, id);
};
