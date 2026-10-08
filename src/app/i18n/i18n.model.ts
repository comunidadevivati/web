import type { ptBR } from '@/app/i18n/locales/pt-BR';

export const LOCALES = ['pt-BR', 'en-US'] as const;

export type Locale = (typeof LOCALES)[number];

export type LocalePreference = 'system' | Locale;

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const LOCALE_STORAGE_KEY = '@comunidade-viva:web:locale';

// Mesma estrutura de chaves do pt-BR, com qualquer texto: todo idioma precisa satisfazer este tipo.
type TranslationShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : TranslationShape<T[Key]>;
};

export type Translations = TranslationShape<typeof ptBR>;

export type TranslationNamespace = keyof Translations;

// Escolhe o idioma: a preferência do usuário ou, em "system", o primeiro idioma suportado do navegador.
export const resolveLocale = (
  preference: LocalePreference,
  browserLanguages: readonly string[],
): Locale => {
  if (preference !== 'system') {
    return preference;
  }

  for (const language of browserLanguages) {
    const normalized = language.toLowerCase();

    if (normalized.startsWith('pt')) {
      return 'pt-BR';
    }

    if (normalized.startsWith('en')) {
      return 'en-US';
    }
  }

  return DEFAULT_LOCALE;
};

export const isLocale = (value: string): value is Locale => {
  return (LOCALES as readonly string[]).includes(value);
};
