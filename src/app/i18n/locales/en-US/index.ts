import type { Translations } from '@/app/i18n/i18n.model';
import { common } from '@/app/i18n/locales/en-US/common';
import {
  auth,
  communication,
  contact,
  dashboard,
  departments,
  forms,
  gallery,
  guestWifi,
  home,
  members,
  organization,
  photos,
  profile,
  users,
} from '@/app/i18n/locales/en-US/features';

export const enUS = {
  common,
  auth,
  home,
  dashboard,
  contact,
  guestWifi,
  organization,
  users,
  members,
  gallery,
  photos,
  profile,
  departments,
  forms,
  communication,
} as const satisfies Translations;
