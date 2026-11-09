import type {
  BacklogCard,
  BacklogCardStatus,
  BacklogGateway,
} from '@/features/backlog/domain/backlog-card';
import { backlogHttpGateway } from '@/features/backlog/infrastructure/http/backlog-http.gateway';

type MoveBacklogCardCommand = {
  csrfToken: string;
  card: BacklogCard;
  status: BacklogCardStatus;
};

export const moveBacklogCardUseCase = (
  { card, csrfToken, status }: MoveBacklogCardCommand,
  gateway: BacklogGateway = backlogHttpGateway,
) => {
  return gateway.moveCard(csrfToken, card.id, card.version, status);
};
