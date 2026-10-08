import type { ThemePreference } from '@/app/theme/theme.model';
import { useThemeStore } from '@/app/theme/theme.store';
import {
  PreferenceToggleGroup,
  type PreferenceOption,
  type PreferenceOrientation,
  type PreferenceSize,
  type PreferenceTone,
} from '@/components/molecules/preference-toggle-group/preference-toggle-group';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ThemeToggleProps = {
  tone: PreferenceTone;
  orientation?: PreferenceOrientation;
  size?: PreferenceSize;
  className?: string;
};

// Escolha do tema: sistema, claro ou escuro. A escolha vale para toda a aplicação.
export const ThemeToggle = ({ className, orientation, size, tone }: ThemeToggleProps) => {
  const { preference, setPreference } = useThemeStore();

  const { t } = useTranslation();

  const options: PreferenceOption<ThemePreference>[] = [
    { value: 'system', label: t('theme.system'), content: <MonitorIcon /> },
    { value: 'light', label: t('theme.light'), content: <SunIcon /> },
    { value: 'dark', label: t('theme.dark'), content: <MoonIcon /> },
  ];

  return (
    <PreferenceToggleGroup
      className={className}
      label={t('theme.label')}
      options={options}
      orientation={orientation}
      size={size}
      tone={tone}
      value={preference}
      onValueChange={setPreference}
    />
  );
};
