import type { Locale } from '@/app/i18n/i18n.model';

// Atualize a versão sempre que o texto mudar: ela é enviada junto com o aceite e é a data da última
// atualização exibida (AAAA-MM-DD).
export const GUEST_WIFI_TERMS_VERSION = '2026-10-07';

export type GuestWifiTermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type GuestWifiTermsDocument = {
  // Aviso exibido antes dos termos, ex.: tradução de cortesia.
  notice?: string;
  sections: GuestWifiTermsSection[];
};

export type GuestWifiTermsByLocale = Record<Locale, GuestWifiTermsDocument>;
