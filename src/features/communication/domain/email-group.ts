// Grupos de e-mails (ADR 0013 do backend): listas nomeadas de contas verificadas que recebem
// comunicações, como os formulários dos departamentos.

export type EmailGroup = {
  id: string;
  name: string;
  description: string | null;
  // Contas (usuários do BFF) que fazem parte do grupo.
  memberAccountIds: string[];
  // Versão lida: a edição a devolve (concorrência otimista).
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type EmailGroupSummary = {
  id: string;
  name: string;
  description: string | null;
  recipientCount: number;
  updatedAt: string;
};

// Conta que pode entrar em um grupo: ativa e com e-mail verificado, membro ou não.
export type EmailRecipient = {
  id: string;
  name: string;
  email: string;
  isMember: boolean;
};

export type EmailGroupDetails = {
  name: string;
  description: string | null;
  memberAccountIds: string[];
};

// Limites do grupo (o servidor aplica os mesmos).
export const EMAIL_GROUP_NAME_MAX_LENGTH = 80;

export const EMAIL_GROUP_DESCRIPTION_MAX_LENGTH = 300;

// Campos recusados pelo servidor, no formato de caminho do contrato (ex.: name).
export class InvalidEmailGroupDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid email group data');

    this.name = 'InvalidEmailGroupDataError';

    this.fields = fields;
  }
}

// Conflito (nome repetido, versão desatualizada). detail é a explicação do servidor, quando houver.
export class EmailGroupConflictError extends Error {
  readonly detail?: string;

  readonly fields: string[];

  constructor(detail?: string, fields: string[] = []) {
    super('Email group conflict');

    this.name = 'EmailGroupConflictError';

    this.detail = detail;

    this.fields = fields;
  }
}

export class EmailGroupNotFoundError extends Error {
  constructor() {
    super('Email group not found');

    this.name = 'EmailGroupNotFoundError';
  }
}

// Conta sem permissão (HTTP 403).
export class EmailGroupAccessDeniedError extends Error {
  constructor() {
    super('Email group access denied');

    this.name = 'EmailGroupAccessDeniedError';
  }
}

// O BFF não respondeu ou respondeu fora do contrato.
export class CommunicationUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Communication service unavailable', { cause });

    this.name = 'CommunicationUnavailableError';
  }
}

// Alterações exigem o token CSRF da sessão; a edição exige também a versão lida.
export interface CommunicationGateway {
  listEmailGroups: () => Promise<EmailGroupSummary[]>;
  getEmailGroup: (id: string) => Promise<EmailGroup>;
  createEmailGroup: (csrfToken: string, details: EmailGroupDetails) => Promise<EmailGroup>;
  updateEmailGroup: (
    csrfToken: string,
    id: string,
    version: number,
    details: EmailGroupDetails,
  ) => Promise<EmailGroup>;
  deleteEmailGroup: (csrfToken: string, id: string) => Promise<void>;
  listEmailRecipients: () => Promise<EmailRecipient[]>;
}
