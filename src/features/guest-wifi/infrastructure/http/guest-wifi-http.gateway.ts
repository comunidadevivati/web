import {
  GuestWifiAuthorizationError,
  type GuestWifiGateway,
} from '@/features/guest-wifi/domain/guest-wifi';
import { workerApiClient } from '@/shared/http/worker-api-client';
import { HTTPError } from 'ky';

type AuthorizeErrorBody = {
  error?: string;
  reason?: string;
  omadaErrorCode?: number;
  fields?: string[];
};

// Converte a resposta de erro do Worker em um código curto, ex.: "omada_authorization_failed -41501".
const toAuthorizationError = (error: unknown) => {
  if (!(error instanceof HTTPError)) {
    return new GuestWifiAuthorizationError('network_error');
  }

  const body = (typeof error.data === 'object' ? error.data : undefined) as
    | AuthorizeErrorBody
    | undefined;

  const code = [
    body?.reason ?? body?.error ?? `http_${error.response.status}`,
    body?.omadaErrorCode,
    body?.fields?.join(','),
  ]
    .filter((part) => part !== undefined && part !== '')
    .join(' ');

  return new GuestWifiAuthorizationError(code);
};

export const guestWifiHttpGateway: GuestWifiGateway = {
  authorize: async (authorization) => {
    try {
      await workerApiClient.post('guest-wifi/authorize', {
        json: authorization,
      });
    } catch (error) {
      throw toAuthorizationError(error);
    }
  },
};
