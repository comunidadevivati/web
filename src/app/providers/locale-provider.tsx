import '@/app/i18n/i18n.config';
import { useLocaleSync } from '@/app/i18n/use-locale-sync';
import type { PropsWithChildren } from 'react';

// Mantém o idioma da aplicação sincronizado com a preferência do usuário e com o navegador.
export const LocaleProvider = ({ children }: PropsWithChildren) => {
  useLocaleSync();

  return children;
};
