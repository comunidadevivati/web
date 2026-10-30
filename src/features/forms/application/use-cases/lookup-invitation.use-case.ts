import type { FormAnswersGateway } from '@/features/forms/domain/form-answer';
import { formAnswersHttpGateway } from '@/features/forms/infrastructure/http/form-answers-http.gateway';

export const lookupInvitationUseCase = (
  token: string,
  gateway: FormAnswersGateway = formAnswersHttpGateway,
) => {
  return gateway.lookup(token);
};
