import type { ptBR } from '@/app/i18n/locales/pt-BR';
import 'i18next';

// Tipagem global das chaves: t('chave') só compila se a chave existir no pt-BR.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof ptBR;
    returnNull: false;
  }
}
