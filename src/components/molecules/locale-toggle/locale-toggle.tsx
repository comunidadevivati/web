import { isLocale, type Locale } from '@/app/i18n/i18n.model';
import { useLocaleStore } from '@/app/i18n/locale.store';
import {
  PreferenceToggleGroup,
  type PreferenceOption,
  type PreferenceOrientation,
  type PreferenceSize,
  type PreferenceTone,
} from '@/components/molecules/preference-toggle-group/preference-toggle-group';
import { useTranslation } from 'react-i18next';

type LocaleToggleProps = {
  tone: PreferenceTone;
  orientation?: PreferenceOrientation;
  size?: PreferenceSize;
  className?: string;
};

// Escolha do idioma (pt-BR ou en-US). Enquanto o usuário não escolhe, segue o idioma do navegador.
export const LocaleToggle = ({ className, orientation, size, tone }: LocaleToggleProps) => {
  const { setPreference } = useLocaleStore();

  const { i18n, t } = useTranslation();

  const currentLocale: Locale = isLocale(i18n.language) ? i18n.language : 'pt-BR';

  const options: PreferenceOption<Locale>[] = [
    { value: 'pt-BR', label: t('language.ptBR'), content: t('language.ptBRShort') },
    { value: 'en-US', label: t('language.enUS'), content: t('language.enUSShort') },
  ];

  return (
    <PreferenceToggleGroup
      className={className}
      label={t('language.label')}
      options={options}
      orientation={orientation}
      size={size}
      tone={tone}
      value={currentLocale}
      onValueChange={setPreference}
    />
  );
};
