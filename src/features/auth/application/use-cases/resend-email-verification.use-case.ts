import type { EmailVerificationGateway } from '@/features/auth/domain/email-verification';
import { emailVerificationHttpGateway } from '@/features/auth/infrastructure/http/email-verification-http.gateway';

export const resendEmailVerificationUseCase = (
  csrfToken: string,
  gateway: EmailVerificationGateway = emailVerificationHttpGateway,
) => {
  return gateway.resendEmailVerification(csrfToken);
};
