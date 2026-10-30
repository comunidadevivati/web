import type { FormHeaderImage, FormQuestion } from '@/features/forms/domain/form';

// Resposta de um formulário pelo link pessoal enviado por e-mail (ADR 0013 do backend). O token do
// link é a credencial: a página é pública, sem sessão.

export const INPUT_ANSWER_MAX_LENGTH = 500;

export const TEXTAREA_ANSWER_MAX_LENGTH = 5000;

// Formato do token gerado pelo servidor (32 bytes em base64url).
export const ANSWER_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;

// OPEN: aceita resposta. NOT_STARTED/ENDED: fora do período. CLOSED: não publicado, finalizado ou
// cancelado.
export type InvitationAvailability = 'OPEN' | 'NOT_STARTED' | 'ENDED' | 'CLOSED';

// Texto (texto curto, longo e data AAAA-MM-DD), opções marcadas (checkbox, radio, lista) ou valor
// (escala e número).
export type FormAnswer = {
  questionId: string;
  text: string | null;
  optionIds: string[];
  value: number | null;
};

export type FormInvitation = {
  recipient: { name: string; email: string };
  status: 'PENDING' | 'ANSWERED';
  // PAPER: a resposta foi registrada no painel a partir da versão impressa.
  answerChannel: 'DIGITAL' | 'PAPER' | null;
  answeredAt: string | null;
  answers: FormAnswer[];
  availability: InvitationAvailability;
  form: {
    title: string;
    description: string | null;
    startsOn: string;
    endsOn: string;
    headerImage: Pick<FormHeaderImage, 'url' | 'width' | 'height'> | null;
    questions: FormQuestion[];
    // Anônimo: as respostas não ficam ligadas à pessoa (e não são exibidas de volta).
    anonymous: boolean;
    // Quem respondeu pelo link pode alterar a resposta até o fim do período.
    allowAnswerEdit: boolean;
    // Texto de consentimento (LGPD) a aceitar antes de responder.
    consentText: string | null;
  };
};

// Link inválido ou substituído por um envio mais recente.
export class InvitationNotFoundError extends Error {
  constructor() {
    super('Form invitation not found');

    this.name = 'InvitationNotFoundError';
  }
}

// Respostas recusadas pelo servidor (answers.<índice da pergunta>).
export class InvalidAnswersError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid answers');

    this.name = 'InvalidAnswersError';

    this.fields = fields;
  }
}

// Já respondido ou fora do período. detail é a explicação do servidor.
export class AnswerConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Answer conflict');

    this.name = 'AnswerConflictError';

    this.detail = detail;
  }
}

export interface FormAnswersGateway {
  lookup: (token: string) => Promise<FormInvitation>;
  submit: (
    token: string,
    answers: FormAnswer[],
    consentAccepted: boolean,
    // Cópia das respostas em PDF para o e-mail de quem respondeu.
    sendCopy: boolean,
  ) => Promise<FormInvitation>;
}
