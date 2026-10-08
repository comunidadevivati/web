import type {
  GuestWifiAuthorization,
  GuestWifiGateway,
} from '@/features/guest-wifi/domain/guest-wifi';
import { guestWifiHttpGateway } from '@/features/guest-wifi/infrastructure/http/guest-wifi-http.gateway';

export const authorizeGuestWifiUseCase = (
  authorization: GuestWifiAuthorization,
  gateway: GuestWifiGateway = guestWifiHttpGateway,
) => {
  return gateway.authorize(authorization);
};
