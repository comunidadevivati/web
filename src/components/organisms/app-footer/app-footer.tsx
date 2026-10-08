import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import { TooltipHint } from '@/components/molecules';
import { Box, Image, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

// Razão social e CNPJ exibidos no tooltip do símbolo da igreja.
const INSTITUTION_DESCRIPTION = 'IGREJA EVANGÉLICA VIVA E EFICAZ - CNPJ: 14.158.325/0001-01';

type AppFooterProps = {
  className?: string;
};

// Rodapé fixo da aplicação: mesma superfície, cores e altura do header, nos dois temas.
export const AppFooter = ({ className }: AppFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      className={cn(
        `
          sticky bottom-0 z-30 border-t border-header-border bg-header/95 shadow-elevated
          backdrop-blur
        `,
        className,
      )}
      role="contentinfo"
    >
      <Box
        className="
          mx-auto flex h-16 w-full max-w-360 flex-col items-center justify-center gap-0.5 px-4
          text-center sm:px-6 md:grid md:h-18 md:grid-cols-[1fr_auto_1fr] md:gap-4 lg:px-8
        "
      >
        <Text className="text-[0.7rem] text-header-foreground/75 sm:text-sm md:justify-self-start">
          © {currentYear} Comunidade Viva. Todos os direitos reservados.
        </Text>

        <TooltipHint label={INSTITUTION_DESCRIPTION} side="top">
          <Box
            aria-label={INSTITUTION_DESCRIPTION}
            className="
              rounded-md transition-transform duration-200 hover:scale-110 focus-visible:ring-2
              focus-visible:ring-header-accent focus-visible:outline-none
            "
            role="img"
            tabIndex={0}
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-5 object-contain md:size-9"
              src={livingStoneGreen}
            />
          </Box>
        </TooltipHint>

        <Box className="flex items-center gap-1 md:justify-self-end">
          <Text className="text-[0.7rem] text-header-foreground/75 sm:text-sm">
            Desenvolvido por
          </Text>

          <Text className="text-[0.7rem] font-semibold text-header-accent-foreground sm:text-sm">
            ComVivaTI
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
