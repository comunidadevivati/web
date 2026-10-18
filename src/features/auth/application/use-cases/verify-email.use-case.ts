import type { EmailVerificationGateway } from '@/features/auth/domain/email-verification';
import { emailVerificationHttpGateway } from '@/features/auth/infrastructure/http/email-verification-http.gateway';

export const verifyEmailUseCase = (
  token: string,
  gateway: EmailVerificationGateway = emailVerificationHttpGateway,
) => {
  return gateway.verifyEmail(token);
};
