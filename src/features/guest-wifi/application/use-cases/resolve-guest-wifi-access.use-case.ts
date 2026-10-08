import type { GuestWifiAccess } from '@/features/guest-wifi/domain/guest-wifi';
import {
  parseOmadaRedirect,
  type OmadaRedirectParams,
} from '@/features/guest-wifi/infrastructure/omada/omada-redirect';

// Retorna null quando a página não foi aberta pelo portal cativo da rede de visitantes.
export const resolveGuestWifiAccessUseCase = (
  params: OmadaRedirectParams,
): GuestWifiAccess | null => {
  return parseOmadaRedirect(params);
};
