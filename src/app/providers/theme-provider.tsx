import { useThemeSync } from '@/app/theme/use-theme-sync';
import type { PropsWithChildren } from 'react';

// Mantém o tema da aplicação sincronizado com a preferência do usuário e com o sistema.
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  useThemeSync();

  return children;
};
