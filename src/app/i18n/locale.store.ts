import { LOCALE_STORAGE_KEY, type LocalePreference } from '@/app/i18n/i18n.model';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type LocaleState = {
  preference: LocalePreference;
  setPreference: (preference: LocalePreference) => void;
};

// Preferência de idioma do usuário, salva no aparelho. Por padrão segue o idioma do navegador.
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      preference: 'system',

      setPreference: (preference) => {
        set({ preference });
      },
    }),
    {
      name: LOCALE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
