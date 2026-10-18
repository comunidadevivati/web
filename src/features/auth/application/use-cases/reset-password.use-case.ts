import type {
  PasswordRecoveryGateway,
  PasswordReset,
} from '@/features/auth/domain/password-recovery';
import { passwordRecoveryHttpGateway } from '@/features/auth/infrastructure/http/password-recovery-http.gateway';

export const resetPasswordUseCase = (
  passwordReset: PasswordReset,
  gateway: PasswordRecoveryGateway = passwordRecoveryHttpGateway,
) => {
  return gateway.resetPassword(passwordReset);
};
