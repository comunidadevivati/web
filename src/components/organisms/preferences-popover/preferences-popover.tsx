import { LocaleToggle, ThemeToggle, TooltipHint } from '@/components/molecules';
import {
  Box,
  Button,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Text,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PreferencesPopoverProps = {
  className?: string;
};

// Preferências (idioma e tema) recolhidas em um botão, para áreas estreitas como o footer no celular.
export const PreferencesPopover = ({ className }: PreferencesPopoverProps) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <TooltipHint label={t('preferences.label')} side="top">
        <PopoverTrigger
          render={
            <Button
              aria-label={t('preferences.open')}
              className={cn(
                `
                  size-10 shrink-0 text-header-foreground/75 hover:bg-header-accent/10
                  hover:text-header-accent-foreground aria-expanded:bg-header-accent/15
                  aria-expanded:text-header-accent-foreground
                `,
                className,
              )}
              size="icon"
              type="button"
              variant="ghost"
            />
          }
        >
          <SlidersHorizontalIcon />
        </PopoverTrigger>
      </TooltipHint>

      <PopoverContent align="end" className="w-auto gap-3 p-3" side="top" sideOffset={10}>
        <PopoverHeader>
          <PopoverTitle>{t('preferences.label')}</PopoverTitle>
        </PopoverHeader>

        <Box className="flex items-center justify-between gap-4">
          <Text className="text-sm text-popover-foreground">{t('language.label')}</Text>

          <LocaleToggle tone="surface" />
        </Box>

        <Box className="flex items-center justify-between gap-4">
          <Text className="text-sm text-popover-foreground">{t('theme.label')}</Text>

          <ThemeToggle tone="surface" />
        </Box>
      </PopoverContent>
    </Popover>
  );
};
