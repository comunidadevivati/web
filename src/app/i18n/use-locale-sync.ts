import { resolveLocale } from '@/app/i18n/i18n.model';
import { useLocaleStore } from '@/app/i18n/locale.store';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Aplica o idioma escolhido no i18next e no <html lang>, acompanhando o idioma do navegador
// enquanto a preferência for "system".
export const useLocaleSync = () => {
  const { preference } = useLocaleStore();

  const { i18n } = useTranslation();

  useLayoutEffect(() => {
    const applyLocale = () => {
      const locale = resolveLocale(preference, navigator.languages);

      if (i18n.language !== locale) {
        void i18n.changeLanguage(locale);
      }

      document.documentElement.lang = locale;
    };

    applyLocale();

    if (preference !== 'system') {
      return;
    }

    window.addEventListener('languagechange', applyLocale);

    return () => {
      window.removeEventListener('languagechange', applyLocale);
    };
  }, [i18n, preference]);
};
