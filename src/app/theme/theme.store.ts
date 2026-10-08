import { THEME_STORAGE_KEY, type ThemePreference } from '@/app/theme/theme.model';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

// Preferência de tema do usuário, salva no aparelho. Por padrão segue o sistema operacional.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',

      setPreference: (preference) => {
        set({ preference });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
