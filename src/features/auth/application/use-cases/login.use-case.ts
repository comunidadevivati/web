import type { AuthSessionGateway, LoginCredentials } from '@/features/auth/domain/auth-session';
import { authSessionHttpGateway } from '@/features/auth/infrastructure/http/auth-session-http.gateway';

export const loginUseCase = (
  credentials: LoginCredentials,
  gateway: AuthSessionGateway = authSessionHttpGateway,
) => {
  return gateway.login(credentials);
};
