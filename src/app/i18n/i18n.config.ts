import { DEFAULT_LOCALE, LOCALES, resolveLocale } from '@/app/i18n/i18n.model';
import { useLocaleStore } from '@/app/i18n/locale.store';
import { enUS } from '@/app/i18n/locales/en-US';
import { ptBR } from '@/app/i18n/locales/pt-BR';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  'pt-BR': ptBR,
  'en-US': enUS,
} as const;

export const i18n = i18next;

// Os dois idiomas vão no bundle: são pequenos e assim funcionam offline no PWA.
// O idioma inicial vem da preferência salva (hidratada de forma síncrona pelo store).
void i18n.use(initReactI18next).init({
  resources,
  lng: resolveLocale(useLocaleStore.getState().preference, navigator.languages),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LOCALES,
  defaultNS: 'common',
  ns: Object.keys(ptBR),
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  initAsync: false,
});
