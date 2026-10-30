import type {
  CommunicationGateway,
  EmailGroup,
  EmailGroupDetails,
} from '@/features/communication/domain/email-group';
import { communicationHttpGateway } from '@/features/communication/infrastructure/http/communication-http.gateway';

type SaveEmailGroupCommand = {
  csrfToken: string;
  // Grupo em edição (com a versão lida); null cria um novo.
  group: EmailGroup | null;
  details: EmailGroupDetails;
};

export const saveEmailGroupUseCase = (
  { csrfToken, details, group }: SaveEmailGroupCommand,
  gateway: CommunicationGateway = communicationHttpGateway,
) => {
  return group
    ? gateway.updateEmailGroup(csrfToken, group.id, group.version, details)
    : gateway.createEmailGroup(csrfToken, details);
};
