// Usuário autenticado, como o BFF o expõe na sessão.
export type AuthUser = {
  subject: string;
  email?: string;
  name?: string;
};

// Sessão ativa no BFF. O cookie HttpOnly fica no navegador; o front só conhece o usuário e o token
// CSRF, mantido apenas em memória (cache do TanStack Query), nunca em storage.
export type AuthSession = {
  csrfToken: string;
  user: AuthUser;
};

// Credenciais digitadas no login. Vão direto ao BFF e nunca são guardadas no front.
export type LoginCredentials = {
  email: string;
  password: string;
};

// O BFF não respondeu ou respondeu fora do contrato: não é possível saber se existe sessão.
export class AuthServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Authentication service unavailable', { cause });

    this.name = 'AuthServiceUnavailableError';
  }
}

// E-mail ou senha recusados pelo BFF.
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');

    this.name = 'InvalidCredentialsError';
  }
}

// Limite de tentativas de login atingido (HTTP 429).
export class TooManyLoginAttemptsError extends Error {
  constructor() {
    super('Too many login attempts');

    this.name = 'TooManyLoginAttemptsError';
  }
}

export interface AuthSessionGateway {
  // Sessão atual ou null quando não há sessão (HTTP 401).
  getSession: () => Promise<AuthSession | null>;
  // Cria a sessão no BFF (cookie HttpOnly) a partir de e-mail e senha.
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (csrfToken: string) => Promise<void>;
}
