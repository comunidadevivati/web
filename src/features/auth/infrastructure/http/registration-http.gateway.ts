import {
  AuthServiceUnavailableError,
  TooManyAttemptsError,
} from '@/features/auth/domain/auth-session';
import {
  EmailAlreadyRegisteredError,
  InvalidRegistrationError,
  type RegistrationGateway,
} from '@/features/auth/domain/registration';
import { parseSessionStart } from '@/features/auth/infrastructure/http/session-start.response';
import { bffClient } from '@/shared/http/bff-client';
import { isHTTPError } from 'ky';

export const registrationHttpGateway: RegistrationGateway = {
  // POST /auth/register: 201 = conta criada e sessão aberta pelo BFF (cookie HttpOnly, mesmo corpo
  // do login); 409 = e-mail já cadastrado.
  register: async ({ email, fullName, password, phone }) => {
    let response: Response;

    try {
      response = await bffClient.post('auth/register', {
        json: {
          name: fullName,
          phone,
          email,
          password,
        },
      });
    } catch (error) {
      const status = isHTTPError(error) ? error.response.status : null;

      if (status === 409) {
        throw new EmailAlreadyRegisteredError();
      }

      if (status === 400 || status === 422) {
        throw new InvalidRegistrationError(error);
      }

      if (status === 429) {
        throw new TooManyAttemptsError();
      }

      throw new AuthServiceUnavailableError(error);
    }

    return parseSessionStart(response);
  },
};
