import type { TranslationNamespace } from '@/app/i18n/i18n.model';
import type { ParseKeys } from 'i18next';

// Chave de tradução válida de um namespace, ex.: TranslationKey<'auth'> = 'login.title' | ...
export type TranslationKey<Namespace extends TranslationNamespace> = ParseKeys<Namespace>;
