export type SidebarMode = 'expanded' | 'collapsed' | 'hidden';

// Nome temporário a partir do e-mail, até a API fornecer o nome (ex.: thiago.figueiredo@... → Thiago Figueiredo).
export const getUserDisplayName = (email: string) => {
  const [localPart = ''] = email.split('@');

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join(' ');
};

// Iniciais exibidas no avatar a partir do e-mail (ex.: thiago.figueiredo@... → TF, thiago@... → TH).
export const getUserInitials = (email: string) => {
  const [localPart = ''] = email.split('@');

  const words = localPart.split(/[._-]+/).filter(Boolean);

  const initials =
    words.length >= 2 ? `${words[0].charAt(0)}${words[1].charAt(0)}` : localPart.slice(0, 2);

  return initials.toLocaleUpperCase() || '?';
};
