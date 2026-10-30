import type { FormStatus, FormsGateway } from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

type ListFormsQuery = {
  department: string;
  // null lista todos os status.
  status: FormStatus | null;
  cursor: string | null;
  limit?: number;
};

export const listFormsUseCase = (
  { cursor, department, limit, status }: ListFormsQuery,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.listForms(department, status, cursor, limit);
};
