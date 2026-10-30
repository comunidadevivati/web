import type { FormReportGateway } from '@/features/forms/domain/form-report';
import { formReportHttpGateway } from '@/features/forms/infrastructure/http/form-report-http.gateway';

export const getFormReportUseCase = (
  formId: string,
  gateway: FormReportGateway = formReportHttpGateway,
) => {
  return gateway.getReport(formId);
};
