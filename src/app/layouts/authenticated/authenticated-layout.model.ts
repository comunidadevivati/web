import type { AuthUser } from '@/features/auth/domain/auth-session';

export type SidebarMode = 'expanded' | 'collapsed' | 'hidden';

const getWords = (value: string) => {
  return value.split(/[\s._-]+/).filter(Boolean);
};

// Nome exibido: o nome da sessão ou, sem ele, um nome a partir do e-mail
// (ex.: thiago.figueiredo@... → Thiago Figueiredo).
export const getUserDisplayName = ({ email, name }: AuthUser) => {
  if (name?.trim()) {
    return name.trim();
  }

  const [localPart = ''] = (email ?? '').split('@');

  return getWords(localPart)
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join(' ');
};

// Iniciais do avatar a partir do nome (ex.: Thiago Figueiredo → TF) ou do e-mail (thiago@... → TH).
export const getUserInitials = ({ email, name }: AuthUser) => {
  const source = name?.trim() || (email ?? '').split('@')[0] || '';

  const words = getWords(source);

  const initials =
    words.length >= 2 ? `${words[0].charAt(0)}${words[1].charAt(0)}` : source.slice(0, 2);

  return initials.toLocaleUpperCase() || '?';
};
