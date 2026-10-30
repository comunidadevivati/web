import type { CommunicationGateway } from '@/features/communication/domain/email-group';
import { communicationHttpGateway } from '@/features/communication/infrastructure/http/communication-http.gateway';

type DeleteEmailGroupCommand = {
  csrfToken: string;
  id: string;
};

export const deleteEmailGroupUseCase = (
  { csrfToken, id }: DeleteEmailGroupCommand,
  gateway: CommunicationGateway = communicationHttpGateway,
) => {
  return gateway.deleteEmailGroup(csrfToken, id);
};
