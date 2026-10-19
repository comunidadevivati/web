// Contexto Members: membros e seus vínculos com congregações, como o BFF os expõe.

export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type MemberStatusAction = 'activate' | 'deactivate' | 'archive' | 'restore';

export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export type MembershipStatusAction = 'activate' | 'deactivate';

// Telefone chega só com dígitos; e-mail em minúsculas; data de nascimento ISO (AAAA-MM-DD).
export type Member = {
  id: string;
  fullName: string;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  status: MemberStatus;
  // Versão lida: a edição a devolve (concorrência otimista).
  version: number;
};

export type MemberProfile = {
  fullName: string;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
};

export type MemberPage = {
  items: Member[];
  nextCursor: string | null;
};

export type MemberFilters = {
  status: MemberStatus | null;
  // Membros com vínculo pendente ou ativo nesta congregação.
  congregationId: string | null;
  // Trecho do nome.
  search: string | null;
  cursor: string | null;
};

export type Membership = {
  id: string;
  memberId: string;
  congregationId: string;
  // Vínculo congregacional principal: no máximo um ativo por membro.
  primary: boolean;
  status: MembershipStatus;
  // Datas ISO de início (ativação) e de encerramento.
  startedOn: string | null;
  endedOn: string | null;
  version: number;
  // Código e nome da congregação; null se ela não estiver mais no catálogo.
  congregation: { code: string; name: string } | null;
};

export type MembershipRegistration = {
  congregationId: string;
  primary: boolean;
};

// Campos recusados pelo servidor, no formato de caminho do contrato (ex.: birthDate).
export class InvalidMemberDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid member data');

    this.name = 'InvalidMemberDataError';

    this.fields = fields;
  }
}

// Conflito de regra (versão desatualizada, vínculo principal já ativo, vínculo aberto...).
// detail é a explicação devolvida pelo servidor, quando houver.
export class MemberConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Member conflict');

    this.name = 'MemberConflictError';

    this.detail = detail;
  }
}

export class MemberNotFoundError extends Error {
  constructor() {
    super('Member record not found');

    this.name = 'MemberNotFoundError';
  }
}

// Conta sem e-mail verificado (HTTP 403).
export class MemberAccessDeniedError extends Error {
  constructor() {
    super('Member access denied');

    this.name = 'MemberAccessDeniedError';
  }
}

// O BFF não respondeu ou respondeu fora do contrato.
export class MembersServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Members service unavailable', { cause });

    this.name = 'MembersServiceUnavailableError';
  }
}

// Alterações exigem o token CSRF da sessão; a edição do perfil exige também a versão lida.
export interface MembersGateway {
  listMembers: (filters: MemberFilters) => Promise<MemberPage>;
  getMember: (id: string) => Promise<Member>;
  registerMember: (csrfToken: string, profile: MemberProfile) => Promise<Member>;
  updateMember: (
    csrfToken: string,
    id: string,
    version: number,
    profile: MemberProfile,
  ) => Promise<Member>;
  changeMemberStatus: (
    csrfToken: string,
    id: string,
    action: MemberStatusAction,
  ) => Promise<Member>;
  listMemberships: (memberId: string) => Promise<Membership[]>;
  registerMembership: (
    csrfToken: string,
    memberId: string,
    registration: MembershipRegistration,
  ) => Promise<Membership>;
  changeMembershipStatus: (
    csrfToken: string,
    id: string,
    action: MembershipStatusAction,
  ) => Promise<Membership>;
}
