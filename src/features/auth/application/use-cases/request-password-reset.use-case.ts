import type { PasswordRecoveryGateway } from '@/features/auth/domain/password-recovery';
import { passwordRecoveryHttpGateway } from '@/features/auth/infrastructure/http/password-recovery-http.gateway';

export const requestPasswordResetUseCase = (
  email: string,
  gateway: PasswordRecoveryGateway = passwordRecoveryHttpGateway,
) => {
  return gateway.requestPasswordReset(email);
};
