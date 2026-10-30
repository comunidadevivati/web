import type {
  FormResponsesGateway,
  PaperAttachmentTransfer,
  PaperAttachmentType,
} from '@/features/forms/domain/form-response';
import {
  directPaperAttachmentTransfer,
  formResponsesHttpGateway,
} from '@/features/forms/infrastructure/http/form-responses-http.gateway';

type RegisterPaperAnswerCommand = {
  csrfToken: string;
  formId: string;
  invitationId: string;
  // Formulário preenchido digitalizado (já conferido por checkPaperAttachment); null só marca.
  file: File | null;
};

// Marca a resposta em papel. Com arquivo, envia direto ao bucket e confirma (a confirmação também
// marca a resposta e substitui o anexo anterior).
export const registerPaperAnswerUseCase = async (
  { csrfToken, file, formId, invitationId }: RegisterPaperAnswerCommand,
  gateway: FormResponsesGateway = formResponsesHttpGateway,
  transfer: PaperAttachmentTransfer = directPaperAttachmentTransfer,
) => {
  if (!file) {
    return gateway.markPaperAnswer(csrfToken, formId, invitationId);
  }

  const ticket = await gateway.requestPaperAttachmentUpload(
    csrfToken,
    formId,
    invitationId,
    file.type as PaperAttachmentType,
  );

  await transfer.send(ticket, file);

  return gateway.completePaperAttachmentUpload(csrfToken, formId, invitationId, {
    uploadId: ticket.uploadId,
    fileName: file.name,
  });
};
