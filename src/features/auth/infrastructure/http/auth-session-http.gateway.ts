import {
  AuthServiceUnavailableError,
  InvalidCredentialsError,
  TooManyAttemptsError,
  type AuthSessionGateway,
} from '@/features/auth/domain/auth-session';
import { parseSessionStart } from '@/features/auth/infrastructure/http/session-start.response';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Contrato de GET /auth/me no BFF.
const authMeResponseSchema = z.object({
  authenticated: z.literal(true),
  csrfToken: z.string().min(1),
  user: z.object({
    subject: z.string().min(1),
    email: z.string().optional(),
    name: z.string().optional(),
    emailVerified: z.boolean(),
  }),
});

const hasStatus = (error: unknown, status: number) => {
  return isHTTPError(error) && error.response.status === status;
};

export const authSessionHttpGateway: AuthSessionGateway = {
  getSession: async () => {
    try {
      const { csrfToken, user } = authMeResponseSchema.parse(await bffClient.get('auth/me').json());

      return {
        csrfToken,
        user,
      };
    } catch (error) {
      if (hasStatus(error, 401)) {
        return null;
      }

      throw new AuthServiceUnavailableError(error);
    }
  },

  // POST /auth/login: o sucesso grava o cookie de sessão; 400/401 = credenciais recusadas.
  login: async (credentials) => {
    let response: Response;

    try {
      response = await bffClient.post('auth/login', {
        json: credentials,
      });
    } catch (error) {
      if (hasStatus(error, 400) || hasStatus(error, 401)) {
        throw new InvalidCredentialsError();
      }

      if (hasStatus(error, 429)) {
        throw new TooManyAttemptsError();
      }

      throw new AuthServiceUnavailableError(error);
    }

    return parseSessionStart(response);
  },

  logout: async (csrfToken) => {
    try {
      await bffClient.post('auth/logout', {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });
    } catch (error) {
      // Sessão já expirada ou removida no BFF: não há o que encerrar.
      if (hasStatus(error, 401)) {
        return;
      }

      throw error;
    }
  },
};
