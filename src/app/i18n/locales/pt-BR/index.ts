import { common } from '@/app/i18n/locales/pt-BR/common';
import {
  auth,
  contact,
  dashboard,
  guestWifi,
  home,
  organization,
  users,
} from '@/app/i18n/locales/pt-BR/features';

// pt-BR é a fonte da verdade: define as chaves e a tipagem de todos os outros idiomas.
export const ptBR = {
  common,
  auth,
  home,
  dashboard,
  contact,
  guestWifi,
  organization,
  users,
} as const;
