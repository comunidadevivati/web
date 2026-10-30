// Rascunho da resposta salvo no navegador enquanto a pessoa preenche (localStorage). A chave é o hash
// do token, para o link não ficar gravado; tudo é opcional: sem armazenamento disponível (aba
// anônima, bloqueio), a página funciona sem rascunho.

const PREFIX = 'form-answer-draft:';

// Rascunhos esquecidos expiram em 30 dias.
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const draftKeyOf = async (token: string): Promise<string | null> => {
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));

    return (
      PREFIX +
      [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
    );
  } catch {
    return null;
  }
};

export const loadDraft = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);

    const parsed = raw ? (JSON.parse(raw) as { savedAt: number; value: T }) : null;

    if (!parsed || Date.now() - parsed.savedAt > TTL_MS) {
      return null;
    }

    return parsed.value;
  } catch {
    return null;
  }
};

export const saveDraft = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Sem armazenamento: segue sem rascunho.
  }
};

export const clearDraft = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Sem armazenamento: nada a limpar.
  }
};
