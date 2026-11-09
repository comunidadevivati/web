// Backlog do departamento de Tecnologia (ADR 0014 do backend): solicitações de funcionalidades,
// erros e ajustes que percorrem as etapas do quadro.

// A ordem da lista é a ordem das colunas do quadro.
export const BACKLOG_CARD_STATUSES = [
  'CREATED',
  'PRIORITIZED',
  'REFINED',
  'IN_PROGRESS',
  'TESTING',
  'HOMOLOGATED',
  'DONE',
  'DEPLOYED',
] as const;

export type BacklogCardStatus = (typeof BACKLOG_CARD_STATUSES)[number];

export const BACKLOG_CARD_TYPES = ['FEATURE', 'BUG', 'ADJUSTMENT'] as const;

export type BacklogCardType = (typeof BACKLOG_CARD_TYPES)[number];

// Limites do card (o servidor aplica os mesmos).
export const BACKLOG_CARD_TITLE_MAX_LENGTH = 120;

export const BACKLOG_CARD_DESCRIPTION_MAX_LENGTH = 5000;

// O card pode ir para qualquer outra etapa, avançando ou voltando.
export const canMoveCard = (from: BacklogCardStatus, to: BacklogCardStatus) => {
  return from !== to;
};

export type BacklogCardDetails = {
  title: string;
  description: string;
  type: BacklogCardType;
};

export type BacklogCard = BacklogCardDetails & {
  id: string;
  status: BacklogCardStatus;
  // Versão lida: edição e movimentação a devolvem (concorrência otimista).
  version: number;
  createdAt: string;
  updatedAt: string;
  statusChangedAt: string;
};

// Etapas contadas como "abertas" (ainda não começaram) e "em andamento" no resumo do painel.
const OPEN_STATUSES: readonly BacklogCardStatus[] = ['CREATED', 'PRIORITIZED', 'REFINED'];

const IN_PROGRESS_STATUSES: readonly BacklogCardStatus[] = [
  'IN_PROGRESS',
  'TESTING',
  'HOMOLOGATED',
];

export const summarizeBacklogCards = (cards: readonly BacklogCard[]) => {
  return {
    total: cards.length,
    open: cards.filter(({ status }) => OPEN_STATUSES.includes(status)).length,
    inProgress: cards.filter(({ status }) => IN_PROGRESS_STATUSES.includes(status)).length,
  };
};

// Campos recusados pelo servidor, no formato de caminho do contrato (ex.: title).
export class InvalidBacklogCardDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid backlog card data');

    this.name = 'InvalidBacklogCardDataError';

    this.fields = fields;
  }
}

// Conflito (versão desatualizada, card já na etapa). detail é a explicação do servidor.
export class BacklogCardConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Backlog card conflict');

    this.name = 'BacklogCardConflictError';

    this.detail = detail;
  }
}

export class BacklogCardNotFoundError extends Error {
  constructor() {
    super('Backlog card not found');

    this.name = 'BacklogCardNotFoundError';
  }
}

// Conta sem permissão (HTTP 403).
export class BacklogAccessDeniedError extends Error {
  constructor() {
    super('Backlog access denied');

    this.name = 'BacklogAccessDeniedError';
  }
}

// O BFF não respondeu ou respondeu fora do contrato.
export class BacklogUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Backlog service unavailable', { cause });

    this.name = 'BacklogUnavailableError';
  }
}

// Alterações exigem o token CSRF da sessão; edição e movimentação exigem também a versão lida.
export interface BacklogGateway {
  listCards: () => Promise<BacklogCard[]>;
  createCard: (
    csrfToken: string,
    details: BacklogCardDetails,
    status: BacklogCardStatus,
  ) => Promise<BacklogCard>;
  updateCard: (
    csrfToken: string,
    id: string,
    version: number,
    details: BacklogCardDetails,
  ) => Promise<BacklogCard>;
  moveCard: (
    csrfToken: string,
    id: string,
    version: number,
    status: BacklogCardStatus,
  ) => Promise<BacklogCard>;
  deleteCard: (csrfToken: string, id: string) => Promise<void>;
}
