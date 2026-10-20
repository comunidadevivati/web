// Contexto Organization: a organização (Matriz) e suas congregações, como o BFF as expõe.

export type OrganizationStatus = 'ACTIVE' | 'INACTIVE';

export type CongregationStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export type StatusAction = 'activate' | 'deactivate';

// Endereço brasileiro: CEP com 8 dígitos e UF em maiúsculas.
export type PostalAddress = {
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  postalCode: string;
};

// CNPJ e telefone chegam só com dígitos; o e-mail, em minúsculas.
export type Organization = {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  address: PostalAddress;
  phone: string;
  email: string;
  status: OrganizationStatus;
  // Versão lida: toda alteração a devolve (concorrência otimista).
  version: number;
};

export type Congregation = {
  id: string;
  organizationId: string;
  // Código institucional estável (ex.: SEDE); não muda após o registro.
  code: string;
  name: string;
  cnpj: string | null;
  address: PostalAddress;
  phone: string | null;
  email: string | null;
  // Sede: a congregação principal da organização.
  headquarters: boolean;
  status: CongregationStatus;
  version: number;
};

export type CongregationPage = {
  items: Congregation[];
  // Cursor da próxima página, ou null na última.
  nextCursor: string | null;
};

export type CongregationFilters = {
  status: CongregationStatus | null;
  cursor: string | null;
  // Itens por página (o BFF aceita até 100; sem valor, usa o padrão de 20).
  limit?: number;
};

export type OrganizationDetails = {
  legalName: string;
  tradeName: string;
  cnpj: string;
  address: PostalAddress;
  phone: string;
  email: string;
};

export type CongregationDetails = {
  name: string;
  cnpj: string | null;
  address: PostalAddress;
  phone: string | null;
  email: string | null;
};

export type CongregationRegistration = CongregationDetails & {
  code: string;
};

// Campos recusados pelo servidor, no formato de caminho do contrato (ex.: address.postalCode).
export class InvalidOrganizationDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid organization data');

    this.name = 'InvalidOrganizationDataError';

    this.fields = fields;
  }
}

// Conflito de regra (versão desatualizada, código em uso, situação que não permite a operação...).
// detail é a explicação devolvida pelo servidor, quando houver.
export class OrganizationConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Organization conflict');

    this.name = 'OrganizationConflictError';

    this.detail = detail;
  }
}

export class OrganizationNotFoundError extends Error {
  constructor() {
    super('Organization record not found');

    this.name = 'OrganizationNotFoundError';
  }
}

// Conta sem e-mail verificado (HTTP 403).
export class OrganizationAccessDeniedError extends Error {
  constructor() {
    super('Organization access denied');

    this.name = 'OrganizationAccessDeniedError';
  }
}

// O BFF não respondeu ou respondeu fora do contrato.
export class OrganizationServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Organization service unavailable', { cause });

    this.name = 'OrganizationServiceUnavailableError';
  }
}

// Alterações exigem o token CSRF da sessão e a versão lida.
export interface OrganizationGateway {
  getOrganization: () => Promise<Organization>;
  updateOrganization: (
    csrfToken: string,
    version: number,
    details: OrganizationDetails,
  ) => Promise<Organization>;
  changeOrganizationStatus: (csrfToken: string, action: StatusAction) => Promise<Organization>;
  listCongregations: (filters: CongregationFilters) => Promise<CongregationPage>;
  registerCongregation: (
    csrfToken: string,
    registration: CongregationRegistration,
  ) => Promise<Congregation>;
  updateCongregation: (
    csrfToken: string,
    id: string,
    version: number,
    details: CongregationDetails,
  ) => Promise<Congregation>;
  changeCongregationStatus: (
    csrfToken: string,
    id: string,
    action: StatusAction,
  ) => Promise<Congregation>;
}
