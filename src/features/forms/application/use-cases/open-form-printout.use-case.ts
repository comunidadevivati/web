import { openPdfTab } from '@/features/forms/infrastructure/browser/open-pdf-tab';

// PDF do formulário em branco para imprimir (gerado pelo BFF), aberto numa nova aba.
export const openFormPrintoutUseCase = (
  formId: string,
  open: (path: string) => boolean = openPdfTab,
) => {
  return open(`/api/v1/forms/${encodeURIComponent(formId)}/printout.pdf`);
};
