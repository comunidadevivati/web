import { i18n } from '@/app/i18n/i18n.config';
import { DEFAULT_LOCALE } from '@/app/i18n/i18n.model';
import '@testing-library/jest-dom/vitest';

// Os testes usam o idioma padrão (pt-BR), independentemente do idioma do navegador do jsdom.
await i18n.changeLanguage(DEFAULT_LOCALE);
