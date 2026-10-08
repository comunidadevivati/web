import { getLocalizedPageTitle } from '@/app/router/page-title';
import { guestWifiSearchSchema } from '@/features/guest-wifi/presentation/models/guest-wifi.model';
import { GuestWifiView } from '@/features/guest-wifi/presentation/views/guest-wifi.view';
import { createFileRoute } from '@tanstack/react-router';

// Portal cativo da rede "VIVA - Visitantes". O endereço é configurado no Omada Controller
// (External Portal Server) e, propositalmente, não aparece em nenhum menu.
export const Route = createFileRoute('/wifi-visitantes')({
  validateSearch: guestWifiSearchSchema,
  head: () => ({
    meta: [{ title: getLocalizedPageTitle('guestWifi') }, { name: 'robots', content: 'noindex' }],
  }),
  component: GuestWifiView,
});
