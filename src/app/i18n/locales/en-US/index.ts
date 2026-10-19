import type { Translations } from '@/app/i18n/i18n.model';
import { common } from '@/app/i18n/locales/en-US/common';
import {
  auth,
  contact,
  dashboard,
  guestWifi,
  home,
  members,
  organization,
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
} as const satisfies Translations;
