import {
  AuthServiceUnavailableError,
  type AuthSessionGateway,
} from '@/features/auth/domain/auth-session';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';
import { z } from 'zod';

// Início do fluxo OIDC (Authorization Code + PKCE) no BFF, que redireciona ao Keycloak.
const LOGIN_PATH = '/auth/login';

// Contrato de GET /auth/me (apps/bff/src/auth/presentation/auth-me.controller.ts).
const authMeResponseSchema = z.object({
  authenticated: z.literal(true),
  csrfToken: z.string().min(1),
  user: z.object({
    subject: z.string().min(1),
    email: z.string().optional(),
    name: z.string().optional(),
  }),
});

const isUnauthorized = (error: unknown) => {
  return isHTTPError(error) && error.response.status === 401;
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
      if (isUnauthorized(error)) {
        return null;
      }

      throw new AuthServiceUnavailableError(error);
    }
  },

  startLogin: () => {
    window.location.assign(LOGIN_PATH);
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
      if (isUnauthorized(error)) {
        return;
      }

      throw error;
    }
  },
};
