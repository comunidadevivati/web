import type { FormReportGateway } from '@/features/forms/domain/form-report';
import { openPdfTab } from '@/features/forms/infrastructure/browser/open-pdf-tab';
import { formReportHttpGateway } from '@/features/forms/infrastructure/http/form-report-http.gateway';

// PDF consolidado numa nova aba (visualizador do navegador). false quando a aba foi bloqueada.
export const openReportPdfUseCase = (
  formId: string,
  gateway: FormReportGateway = formReportHttpGateway,
  open: (path: string) => boolean = openPdfTab,
) => {
  return open(gateway.pdfPath(formId));
};

// Endereço do CSV (baixado pelo próprio link, com o cookie de sessão da mesma origem).
export const reportCsvPathUseCase = (
  formId: string,
  gateway: FormReportGateway = formReportHttpGateway,
) => {
  return gateway.csvPath(formId);
};
