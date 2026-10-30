import type { FormResponsesGateway } from '@/features/forms/domain/form-response';
import { openPdfTabFrom } from '@/features/forms/infrastructure/browser/open-pdf-tab';
import { formResponsesHttpGateway } from '@/features/forms/infrastructure/http/form-responses-http.gateway';

// Anexo da resposta em papel numa nova aba (URL assinada de validade curta), no visualizador do
// navegador. false quando a nova aba foi bloqueada. Chamar direto no clique.
export const openPaperAttachmentUseCase = (
  formId: string,
  invitationId: string,
  gateway: FormResponsesGateway = formResponsesHttpGateway,
  open: (loadUrl: () => Promise<string>) => Promise<boolean> = openPdfTabFrom,
) => {
  return open(() => gateway.getPaperAttachmentUrl(formId, invitationId));
};
