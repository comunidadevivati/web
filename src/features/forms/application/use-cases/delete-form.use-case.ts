import type { FormsGateway } from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

type DeleteFormCommand = {
  csrfToken: string;
  id: string;
};

export const deleteFormUseCase = (
  { csrfToken, id }: DeleteFormCommand,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.deleteForm(csrfToken, id);
};
