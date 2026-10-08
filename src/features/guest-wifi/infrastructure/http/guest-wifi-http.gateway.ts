import type { GuestWifiGateway } from '@/features/guest-wifi/domain/guest-wifi';
import { workerApiClient } from '@/shared/http/worker-api-client';

export const guestWifiHttpGateway: GuestWifiGateway = {
  authorize: async (authorization) => {
    await workerApiClient.post('guest-wifi/authorize', {
      json: authorization,
    });
  },
};
