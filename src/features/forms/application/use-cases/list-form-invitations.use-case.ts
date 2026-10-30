import type { FormResponsesGateway } from '@/features/forms/domain/form-response';
import { formResponsesHttpGateway } from '@/features/forms/infrastructure/http/form-responses-http.gateway';

export const listFormInvitationsUseCase = (
  formId: string,
  gateway: FormResponsesGateway = formResponsesHttpGateway,
) => {
  return gateway.listInvitations(formId);
};
