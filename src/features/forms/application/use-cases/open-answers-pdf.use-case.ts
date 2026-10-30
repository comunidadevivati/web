import { openPdfTab } from '@/features/forms/infrastructure/browser/open-pdf-tab';

// PDF das respostas digitais de uma pessoa (gerado pelo BFF), aberto numa nova aba.
export const openAnswersPdfUseCase = (
  formId: string,
  invitationId: string,
  open: (path: string) => boolean = openPdfTab,
) => {
  return open(
    `/api/v1/forms/${encodeURIComponent(formId)}/invitations/${encodeURIComponent(invitationId)}/answers.pdf`,
  );
};
