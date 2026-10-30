import type { FormsGateway } from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

type PurgeAnswersCommand = {
  csrfToken: string;
  id: string;
};

export const purgeAnswersUseCase = (
  { csrfToken, id }: PurgeAnswersCommand,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.purgeAnswers(csrfToken, id);
};
