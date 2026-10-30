import type { FormResponsesGateway } from '@/features/forms/domain/form-response';
import { formResponsesHttpGateway } from '@/features/forms/infrastructure/http/form-responses-http.gateway';

type UnmarkPaperAnswerCommand = {
  csrfToken: string;
  formId: string;
  invitationId: string;
};

export const unmarkPaperAnswerUseCase = (
  { csrfToken, formId, invitationId }: UnmarkPaperAnswerCommand,
  gateway: FormResponsesGateway = formResponsesHttpGateway,
) => {
  return gateway.unmarkPaperAnswer(csrfToken, formId, invitationId);
};
