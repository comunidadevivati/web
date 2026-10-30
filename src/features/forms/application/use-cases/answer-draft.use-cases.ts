import {
  clearDraft,
  draftKeyOf,
  loadDraft,
  saveDraft,
} from '@/features/forms/infrastructure/browser/answer-drafts';

// Rascunho automático da página de resposta (somente neste navegador).
export const answerDraftKeyUseCase = (token: string) => draftKeyOf(token);

export const loadAnswerDraftUseCase = <T>(key: string) => loadDraft<T>(key);

export const saveAnswerDraftUseCase = <T>(key: string, value: T) => saveDraft(key, value);

export const clearAnswerDraftUseCase = (key: string) => clearDraft(key);
