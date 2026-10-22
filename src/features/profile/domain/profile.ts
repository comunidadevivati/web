export const SEXES = ['MALE', 'FEMALE'] as const;

export type Sex = (typeof SEXES)[number];

export const SOCIAL_NETWORKS = ['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export type SocialLinks = Record<SocialNetwork, string | null>;

export type HomeAddress = {
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  // Somente dígitos no Brasil.
  postalCode: string;
  country: string;
  // Ponto de referência.
  reference: string | null;
};

// Cadastro da Pessoa (somente membros têm Perfil). O e-mail principal é o e-mail de acesso da conta.
export type Profile = {
  id: string;
  fullName: string;
  sex: Sex | null;
  // AAAA-MM-DD.
  birthDate: string | null;
  // Telefones somente com dígitos.
  phone: string | null;
  secondaryPhone: string | null;
  email: string | null;
  secondaryEmail: string | null;
  address: HomeAddress | null;
  socialLinks: SocialLinks;
  // URL de leitura de validade curta (1 h); null sem foto.
  avatarUrl: string | null;
  version: number;
};

// Dados gravados pelo formulário do Perfil (substituição completa, sem e-mail principal e foto).
export type ProfileDetails = Omit<Profile, 'id' | 'email' | 'avatarUrl' | 'version'>;

export const AVATAR_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type AvatarContentType = (typeof AVATAR_CONTENT_TYPES)[number];

export const AVATAR_MAX_BYTES = 10 * 1024 * 1024;

export type AvatarUploadTicket = {
  uploadId: string;
  uploadUrl: string;
  contentType: AvatarContentType;
};

// Preferências de comunicação da conta.
export type Subscriptions = {
  news: boolean;
};

export type SecurityResult = {
  message?: string;
};

// Campos recusados pelo servidor, no formato de caminho do formulário (ex.: address.street).
export class InvalidProfileDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid profile data');

    this.name = 'InvalidProfileDataError';

    this.fields = fields;
  }
}

// Conflito: cadastro alterado por outra operação, ou foto recusada. detail vem do servidor.
export class ProfileConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Profile conflict');

    this.name = 'ProfileConflictError';

    this.detail = detail;
  }
}

// Conta sem Pessoa (ainda não é membro): não tem Perfil.
export class ProfileAccessDeniedError extends Error {
  constructor() {
    super('Profile access denied');

    this.name = 'ProfileAccessDeniedError';
  }
}

export class ProfileServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Profile service unavailable', { cause });

    this.name = 'ProfileServiceUnavailableError';
  }
}

// Envio da foto direto ao bucket falhou (rede ou recusa do armazenamento).
export class AvatarTransferError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Avatar transfer failed with status ${status}`);

    this.name = 'AvatarTransferError';

    this.status = status;
  }
}

export type SecurityErrorCode =
  | 'invalidPassword'
  | 'weakPassword'
  | 'sameEmail'
  | 'emailTaken'
  | 'tooManyAttempts'
  | 'invalidLink';

// Recusa esperada das operações de segurança (senha atual errada, e-mail em uso...).
export class AccountSecurityError extends Error {
  readonly code: SecurityErrorCode;

  constructor(code: SecurityErrorCode) {
    super(`Account security error: ${code}`);

    this.name = 'AccountSecurityError';

    this.code = code;
  }
}

export interface ProfileGateway {
  getProfile: () => Promise<Profile>;
  updateProfile: (csrfToken: string, version: number, details: ProfileDetails) => Promise<Profile>;
  requestAvatarUpload: (
    csrfToken: string,
    contentType: AvatarContentType,
  ) => Promise<AvatarUploadTicket>;
  completeAvatarUpload: (csrfToken: string, uploadId: string) => Promise<Profile>;
  removeAvatar: (csrfToken: string) => Promise<Profile>;
  getSubscriptions: () => Promise<Subscriptions>;
  updateSubscriptions: (csrfToken: string, subscriptions: Subscriptions) => Promise<Subscriptions>;
  changePassword: (
    csrfToken: string,
    currentPassword: string,
    newPassword: string,
  ) => Promise<SecurityResult>;
  requestEmailChange: (
    csrfToken: string,
    currentPassword: string,
    newEmail: string,
  ) => Promise<SecurityResult>;
  confirmEmailChange: (token: string) => Promise<SecurityResult>;
}

// Envio do arquivo da foto direto ao bucket de mídia, pela URL pré-assinada.
export interface AvatarTransfer {
  send: (ticket: AvatarUploadTicket, file: File) => Promise<void>;
}
