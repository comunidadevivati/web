import {
  AuthServiceUnavailableError,
  TooManyAttemptsError,
} from '@/features/auth/domain/auth-session';
import {
  EmailAlreadyVerifiedError,
  InvalidEmailVerificationTokenError,
  type EmailVerificationGateway,
} from '@/features/auth/domain/email-verification';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

const emailVerificationResponseSchema = z.object({
  message: z.string().trim().min(1).max(300).optional(),
});

const parseMessage = (body: unknown) => {
  const parsed = emailVerificationResponseSchema.safeParse(body);

  return parsed.success ? parsed.data.message : undefined;
};

const statusOf = (error: unknown) => (isHTTPError(error) ? error.response.status : null);

export const emailVerificationHttpGateway: EmailVerificationGateway = {
  // POST /auth/email-verification: 400 = link inválido, expirado ou já usado.
  verifyEmail: async (token) => {
    try {
      const body: unknown = await bffClient
        .post('auth/email-verification', { json: { token } })
        .json();

      return { message: parseMessage(body) };
    } catch (error) {
      if (statusOf(error) === 400) {
        throw new InvalidEmailVerificationTokenError();
      }

      throw new AuthServiceUnavailableError(error);
    }
  },

  // POST /auth/email-verification/resend: exige a sessão (cookie) e o token CSRF.
  resendEmailVerification: async (csrfToken) => {
    try {
      const body: unknown = await bffClient
        .post('auth/email-verification/resend', { headers: { 'X-CSRF-Token': csrfToken } })
        .json();

      return { message: parseMessage(body) };
    } catch (error) {
      const status = statusOf(error);

      if (status === 409) {
        throw new EmailAlreadyVerifiedError();
      }

      if (status === 429) {
        throw new TooManyAttemptsError();
      }

      throw new AuthServiceUnavailableError(error);
    }
  },
};
