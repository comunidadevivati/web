import type { FormsGateway } from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

type DuplicateFormCommand = {
  csrfToken: string;
  id: string;
};

export const duplicateFormUseCase = (
  { csrfToken, id }: DuplicateFormCommand,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.duplicateForm(csrfToken, id);
};
