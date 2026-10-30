import type { CommunicationGateway } from '@/features/communication/domain/email-group';
import { communicationHttpGateway } from '@/features/communication/infrastructure/http/communication-http.gateway';

export const getEmailGroupUseCase = (
  id: string,
  gateway: CommunicationGateway = communicationHttpGateway,
) => {
  return gateway.getEmailGroup(id);
};
