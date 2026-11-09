import type {
  BacklogCard,
  BacklogCardDetails,
  BacklogCardStatus,
  BacklogGateway,
} from '@/features/backlog/domain/backlog-card';
import { backlogHttpGateway } from '@/features/backlog/infrastructure/http/backlog-http.gateway';

type SaveBacklogCardCommand = {
  csrfToken: string;
  // Card em edição (com a versão lida); null cria um novo.
  card: BacklogCard | null;
  details: BacklogCardDetails;
  // Etapa em que o card novo nasce.
  status: BacklogCardStatus;
};

export const saveBacklogCardUseCase = (
  { card, csrfToken, details, status }: SaveBacklogCardCommand,
  gateway: BacklogGateway = backlogHttpGateway,
) => {
  return card
    ? gateway.updateCard(csrfToken, card.id, card.version, details)
    : gateway.createCard(csrfToken, details, status);
};
