import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import { TooltipHint } from '@/components/molecules';
import { PreferencesControls } from '@/components/organisms/preferences-controls/preferences-controls';
import { PreferencesPopover } from '@/components/organisms/preferences-popover/preferences-popover';
import { Box, Image, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Ano calculado ao carregar o módulo (render puro, sem Date dentro do componente).
const currentYear = new Date().getFullYear();

type AppFooterProps = {
  className?: string;
};

// Rodapé fixo da aplicação, na superfície do header. Usa container queries: o layout se adapta à
// largura do próprio footer (que muda com a sidebar), não só à da tela.
export const AppFooter = ({ className }: AppFooterProps) => {
  const { t } = useTranslation();

  // Razão social e CNPJ exibidos no tooltip do símbolo da igreja.
  const institution = t('footer.institution');

  const copyright = t('footer.copyright', { year: currentYear });

  const symbol = (
    <TooltipHint label={institution} side="top">
      <Box
        aria-label={institution}
        className="
          shrink-0 rounded-md transition-transform duration-200 hover:scale-110 focus-visible:ring-2
          focus-visible:ring-header-accent focus-visible:outline-none
        "
        role="img"
        tabIndex={0}
      >
        <Image
          alt=""
          aria-hidden="true"
          className="size-7 object-contain @3xl:size-8"
          src={livingStoneGreen}
        />
      </Box>
    </TooltipHint>
  );

  const developedBy = (
    <Box className="flex items-center gap-1">
      <Text className="text-[0.7rem] text-header-foreground/60 @3xl:text-xs">
        {t('footer.developedBy')}
      </Text>

      <Text className="text-[0.7rem] font-semibold text-header-accent-foreground @3xl:text-xs">
        ComVivaTI
      </Text>
    </Box>
  );

  return (
    <Box
      className={cn(
        `
          @container sticky bottom-0 z-30 border-t border-header-border bg-header/95 shadow-elevated
          backdrop-blur
        `,
        className,
      )}
      role="contentinfo"
    >
      <Box className="mx-auto flex h-14 w-full max-w-360 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Estreito: símbolo e créditos à esquerda, preferências recolhidas em um botão. */}
        <Box className="flex min-w-0 flex-1 items-center gap-2.5 @3xl:hidden">
          {symbol}

          <Box className="grid min-w-0 gap-0.5">
            <Text className="truncate text-[0.7rem] text-header-foreground/80">{copyright}</Text>

            {developedBy}
          </Box>
        </Box>

        <PreferencesPopover className="@3xl:hidden" />

        {/* Largo: créditos à esquerda, símbolo no centro, autoria e preferências à direita. */}
        <Box className="hidden w-full grid-cols-[1fr_auto_1fr] items-center gap-4 @3xl:grid">
          <Box className="flex min-w-0 items-center gap-1">
            <Text className="truncate text-xs text-header-foreground/80">{copyright}</Text>

            <Text className="hidden truncate text-xs text-header-foreground/60 @5xl:block">
              {t('footer.rightsReserved')}
            </Text>
          </Box>

          {symbol}

          <Box className="flex items-center justify-end gap-3">
            {developedBy}

            <Box aria-hidden="true" className="h-5 w-px bg-header-border" />

            <PreferencesControls size="sm" tone="header" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
