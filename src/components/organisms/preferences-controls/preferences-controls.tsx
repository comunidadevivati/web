import {
  LocaleToggle,
  ThemeToggle,
  type PreferenceOrientation,
  type PreferenceSize,
  type PreferenceTone,
} from '@/components/molecules';
import { Box } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type PreferencesControlsProps = {
  tone: PreferenceTone;
  orientation?: PreferenceOrientation;
  size?: PreferenceSize;
  className?: string;
};

// Preferências globais da aplicação (idioma e tema), disponíveis em todas as áreas.
export const PreferencesControls = ({
  className,
  orientation = 'horizontal',
  size,
  tone,
}: PreferencesControlsProps) => {
  const { t } = useTranslation();

  return (
    <Box
      aria-label={t('preferences.label')}
      className={cn('flex items-center gap-2', orientation === 'vertical' && 'flex-col', className)}
      role="group"
    >
      <LocaleToggle orientation={orientation} size={size} tone={tone} />

      <ThemeToggle orientation={orientation} size={size} tone={tone} />
    </Box>
  );
};
