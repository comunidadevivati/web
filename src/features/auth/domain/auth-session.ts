// Usuário autenticado, como o BFF o expõe a partir do token do Keycloak.
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

// O BFF não respondeu ou respondeu fora do contrato: não é possível saber se existe sessão.
export class AuthServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Authentication service unavailable', { cause });

    this.name = 'AuthServiceUnavailableError';
  }
}

export interface AuthSessionGateway {
  // Sessão atual ou null quando não há sessão (HTTP 401).
  getSession: () => Promise<AuthSession | null>;
  // Leva o navegador ao início do fluxo OIDC no BFF (sai da SPA).
  startLogin: () => void;
  logout: (csrfToken: string) => Promise<void>;
}
