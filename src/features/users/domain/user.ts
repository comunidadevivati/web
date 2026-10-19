import type { Registration } from '@/features/auth/domain/registration';

// Contas de acesso (menu Usuários), como o BFF as expõe na gestão. Nunca incluem a senha.

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  // Somente dígitos; contas criadas pelo CLI podem não ter telefone.
  phone: string | null;
  status: UserStatus;
  // false enquanto a pessoa não confirmar o e-mail pelo link enviado.
  emailVerified: boolean;
  // Data e hora do cadastro em ISO 8601.
  createdAt: string;
  // Data e hora da suspensão em ISO 8601; nulo enquanto a conta está ativa.
  suspendedAt: string | null;
};

export type UserPage = {
  items: UserAccount[];
  nextCursor: string | null;
};

export type UserFilters = {
  status: UserStatus | null;
  // true = somente e-mails verificados; false = somente não verificados; null = todos.
  emailVerified: boolean | null;
  // Trecho do nome ou do e-mail.
  search: string | null;
  cursor: string | null;
};

// Mesmos dados do cadastro da tela de login.
export type NewUser = Registration;

// Alteração de dados: trocar o e-mail exige nova verificação (o BFF envia o link).
export type UserChanges = {
  fullName: string;
  phone: string;
  email: string;
};

export type UserAction = 'suspend' | 'reactivate' | 'delete';

// Recusa do BFF. detail é a mensagem do servidor, exibida no toast quando houver.
export class UserRequestError extends Error {
  readonly detail?: string;

  constructor(message: string, detail?: string) {
    super(message);

    this.name = 'UserRequestError';

    this.detail = detail;
  }
}

// Campos recusados pelo servidor (HTTP 400), no formato do contrato (name, phone, email...).
export class InvalidUserDataError extends UserRequestError {
  readonly fields: string[];

  constructor(fields: string[], detail?: string) {
    super('Invalid user data', detail);

    this.name = 'InvalidUserDataError';

    this.fields = fields;
  }
}

// O servidor encontrou outra conta com o e-mail informado (HTTP 409 no cadastro ou na alteração).
export class UserEmailTakenError extends UserRequestError {
  constructor(detail?: string) {
    super('User email taken', detail);

    this.name = 'UserEmailTakenError';
  }
}

// Regra recusada (HTTP 409): ex.: suspender a própria conta ou excluir conta verificada.
export class UserConflictError extends UserRequestError {
  constructor(detail?: string) {
    super('User conflict', detail);

    this.name = 'UserConflictError';
  }
}

export class UserNotFoundError extends UserRequestError {
  constructor(detail?: string) {
    super('User not found', detail);

    this.name = 'UserNotFoundError';
  }
}

// Conta da sessão sem e-mail verificado (HTTP 403).
export class UsersAccessDeniedError extends UserRequestError {
  constructor(detail?: string) {
    super('Users access denied', detail);

    this.name = 'UsersAccessDeniedError';
  }
}

export class UsersServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Users service unavailable', { cause });

    this.name = 'UsersServiceUnavailableError';
  }
}

// Alterações exigem o token CSRF da sessão.
export interface UsersGateway {
  listUsers: (filters: UserFilters) => Promise<UserPage>;
  createUser: (csrfToken: string, user: NewUser) => Promise<UserAccount>;
  updateUser: (csrfToken: string, id: string, changes: UserChanges) => Promise<UserAccount>;
  suspendUser: (csrfToken: string, id: string) => Promise<UserAccount>;
  reactivateUser: (csrfToken: string, id: string) => Promise<UserAccount>;
  deleteUser: (csrfToken: string, id: string) => Promise<void>;
}
