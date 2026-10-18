import {
  AuthServiceUnavailableError,
  TooManyAttemptsError,
} from '@/features/auth/domain/auth-session';
import {
  InvalidPasswordResetTokenError,
  WeakPasswordResetError,
  type PasswordRecoveryGateway,
} from '@/features/auth/domain/password-recovery';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

const INVALID_RESET_LINK_MESSAGE = 'Link de recuperação inválido ou expirado.';

const WEAK_PASSWORD_MESSAGE = 'A nova senha não atende aos requisitos de segurança.';

const passwordRecoveryResponseSchema = z.object({
  message: z.string().trim().min(1).max(300).optional(),
});

const parseMessage = (body: unknown) => {
  const parsed = passwordRecoveryResponseSchema.safeParse(body);

  return parsed.success ? parsed.data.message : undefined;
};

export const passwordRecoveryHttpGateway: PasswordRecoveryGateway = {
  // O BFF sempre devolve a mesma resposta, exista ou não uma conta, para evitar enumeração.
  requestPasswordReset: async (email) => {
    try {
      const body: unknown = await bffClient
        .post('auth/password-recovery', { json: { email } })
        .json();

      return { message: parseMessage(body) };
    } catch (error) {
      const status = isHTTPError(error) ? error.response.status : null;

      if (status === 429) {
        throw new TooManyAttemptsError();
      }

      throw new AuthServiceUnavailableError(error);
    }
  },

  resetPassword: async (passwordReset) => {
    try {
      const body: unknown = await bffClient
        .post('auth/password-reset', { json: passwordReset })
        .json();

      return { message: parseMessage(body) };
    } catch (error) {
      const status = isHTTPError(error) ? error.response.status : null;

      const message = isHTTPError(error) ? parseMessage(error.data) : undefined;

      if (status === 400 && message === INVALID_RESET_LINK_MESSAGE) {
        throw new InvalidPasswordResetTokenError();
      }

      if (status === 400 && message === WEAK_PASSWORD_MESSAGE) {
        throw new WeakPasswordResetError();
      }

      if (status === 429) {
        throw new TooManyAttemptsError();
      }

      throw new AuthServiceUnavailableError(error);
    }
  },
};
