import type { FormAnswer } from '@/features/forms/domain/form-answer';

// Respostas de um formulário no painel (ADR 0013 do backend): um convite por pessoa dos grupos, com
// a resposta digital (pelo link) ou o registro manual de resposta em papel.

export type AnswerChannel = 'DIGITAL' | 'PAPER';

export type FormInvitationRecord = {
  id: string;
  recipientName: string;
  recipientEmail: string;
  status: 'PENDING' | 'ANSWERED';
  answerChannel: AnswerChannel | null;
  sentAt: string;
  answeredAt: string | null;
  answers: FormAnswer[];
  // Formulário em papel digitalizado (opcional).
  paperAttachment: { fileName: string; contentType: string; byteSize: number } | null;
  // Entrega do último e-mail do convite (webhook do Resend); null antes do primeiro envio.
  deliveryStatus: DeliveryStatus | null;
  deliveryUpdatedAt: string | null;
};

export const DELIVERY_STATUSES = [
  'SENT',
  'DELAYED',
  'DELIVERED',
  'OPENED',
  'CLICKED',
  'BOUNCED',
  'COMPLAINED',
  'FAILED',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

// Anexo da resposta em papel: PDF, JPG/JPEG ou PNG de até 2 MB (o servidor confere o conteúdo).
export const PAPER_ATTACHMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

export type PaperAttachmentType = (typeof PAPER_ATTACHMENT_TYPES)[number];

export const PAPER_ATTACHMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'] as const;

export const MAX_PAPER_ATTACHMENT_BYTES = 2 * 1024 * 1024;

export type PaperAttachmentIssue = 'type' | 'size';

export const checkPaperAttachment = ({ name, size, type }: File): PaperAttachmentIssue | null => {
  const lowerName = name.toLowerCase();

  const accepted =
    (PAPER_ATTACHMENT_TYPES as readonly string[]).includes(type) &&
    PAPER_ATTACHMENT_EXTENSIONS.some((extension) => lowerName.endsWith(extension));

  if (!accepted) {
    return 'type';
  }

  return size > MAX_PAPER_ATTACHMENT_BYTES ? 'size' : null;
};

export type PaperAttachmentTicket = {
  uploadId: string;
  uploadUrl: string;
  contentType: PaperAttachmentType;
  expiresAt: string;
};

export interface PaperAttachmentTransfer {
  send: (ticket: PaperAttachmentTicket, file: File) => Promise<void>;
}

// Alterações exigem o token CSRF da sessão.
export interface FormResponsesGateway {
  listInvitations: (formId: string) => Promise<FormInvitationRecord[]>;
  markPaperAnswer: (
    csrfToken: string,
    formId: string,
    invitationId: string,
  ) => Promise<FormInvitationRecord>;
  unmarkPaperAnswer: (
    csrfToken: string,
    formId: string,
    invitationId: string,
  ) => Promise<FormInvitationRecord>;
  requestPaperAttachmentUpload: (
    csrfToken: string,
    formId: string,
    invitationId: string,
    contentType: PaperAttachmentType,
  ) => Promise<PaperAttachmentTicket>;
  completePaperAttachmentUpload: (
    csrfToken: string,
    formId: string,
    invitationId: string,
    upload: { uploadId: string; fileName: string },
  ) => Promise<FormInvitationRecord>;
  // URL de download de validade curta.
  getPaperAttachmentUrl: (formId: string, invitationId: string) => Promise<string>;
}
