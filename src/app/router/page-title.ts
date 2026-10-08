import { i18n } from '@/app/i18n/i18n.config';
import type { Translations } from '@/app/i18n/i18n.model';

export const APP_TITLE = 'VIVA';

export type PageTitleKey = keyof Translations['common']['pageTitles'];

export const getPageTitle = (page: string) => {
  return `${APP_TITLE} - ${page}`;
};

// Título traduzido da aba do navegador. Atualiza na troca de idioma via useRouteHeadRefresh.
export const getLocalizedPageTitle = (page: PageTitleKey) => {
  return getPageTitle(i18n.t(`pageTitles.${page}`));
};
