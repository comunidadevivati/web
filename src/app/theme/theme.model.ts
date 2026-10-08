export type ThemePreference = 'system' | 'light' | 'dark';

export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

// Mesma chave lida pelo script inline do index.html, que aplica o tema antes do primeiro render.
export const THEME_STORAGE_KEY = '@comunidade-viva:web:theme';

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export const resolveTheme = (preference: ThemePreference, prefersDark: boolean): ResolvedTheme => {
  if (preference === 'system') {
    return prefersDark ? 'dark' : 'light';
  }

  return preference;
};
