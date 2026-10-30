import type { FormsGateway } from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

export const getFormsSummaryUseCase = (
  department: string,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.getFormsSummary(department);
};
