import type { FormsGateway } from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

type StartEmailDispatchCommand = {
  csrfToken: string;
  id: string;
  kind: 'INVITE' | 'REMINDER';
  // Mensagem opcional exibida no e-mail.
  message: string | null;
};

export const startEmailDispatchUseCase = (
  { csrfToken, id, kind, message }: StartEmailDispatchCommand,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.startEmailDispatch(csrfToken, id, { kind, message });
};
