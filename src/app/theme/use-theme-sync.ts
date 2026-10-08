import { DARK_COLOR_SCHEME_QUERY, resolveTheme } from '@/app/theme/theme.model';
import { useThemeStore } from '@/app/theme/theme.store';
import { useLayoutEffect } from 'react';

// Aplica o tema no <html> e acompanha a troca de tema do sistema enquanto a preferência for "system".
export const useThemeSync = () => {
  const { preference } = useThemeStore();

  // useLayoutEffect aplica o tema antes da primeira pintura, evitando piscar o tema errado.
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(DARK_COLOR_SCHEME_QUERY);

    const applyTheme = () => {
      const theme = resolveTheme(preference, mediaQuery.matches);

      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    applyTheme();

    if (preference !== 'system') {
      return;
    }

    mediaQuery.addEventListener('change', applyTheme);

    return () => {
      mediaQuery.removeEventListener('change', applyTheme);
    };
  }, [preference]);
};
