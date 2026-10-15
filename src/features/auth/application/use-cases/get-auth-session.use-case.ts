import type { AuthSessionGateway } from '@/features/auth/domain/auth-session';
import { authSessionHttpGateway } from '@/features/auth/infrastructure/http/auth-session-http.gateway';

export const getAuthSessionUseCase = (gateway: AuthSessionGateway = authSessionHttpGateway) => {
  return gateway.getSession();
};
