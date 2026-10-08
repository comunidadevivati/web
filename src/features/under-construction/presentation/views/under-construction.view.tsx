import maintenancePage from '@/assets/images/maintenance-page.webp';
import { PublicHeader } from '@/components/public-header/public-header';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { useUnderConstructionViewModel } from '@/features/under-construction/presentation/view-models/under-construction.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, HouseIcon } from 'lucide-react';

const actionClassName = `
  inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border px-5 text-base
  font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-shell-accent
  focus-visible:ring-offset-2 focus-visible:ring-offset-shell focus-visible:outline-none sm:w-auto
`;

const primaryActionClassName = `
  border-shell-accent bg-shell-accent text-shell hover:border-shell-accent-foreground
  hover:bg-shell-accent-foreground
`;

const secondaryActionClassName = `
  border-shell-accent/40 bg-shell-accent/10 text-shell-accent-foreground hover:border-shell-accent
  hover:bg-shell-accent/20 hover:text-shell-accent-foreground
`;

type UnderConstructionViewProps = {
  pageName: string;
};

export const UnderConstructionView = ({ pageName }: UnderConstructionViewProps) => {
  const { canGoBack, handleGoBack } = useUnderConstructionViewModel();

  return (
    <Box className="flex min-h-dvh flex-col overflow-x-hidden bg-shell">
      <PublicHeader />

      <Box className="flex flex-1 items-center" role="main">
        <Box
          className="
            mx-auto grid w-full max-w-360 justify-items-center gap-8 px-4 py-10 text-center
            sm:gap-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16
          "
        >
          <Image
            alt=""
            aria-hidden="true"
            className="h-auto max-h-[36dvh] w-full max-w-md object-contain sm:max-w-lg lg:max-w-xl"
            height={771}
            src={maintenancePage}
            width={1200}
          />

          <Box className="grid max-w-xl gap-3">
            <Text
              className="
                text-xs font-semibold tracking-widest text-shell-accent-foreground uppercase
                sm:text-sm
              "
            >
              {pageName}
            </Text>

            <Heading className="text-3xl text-shell-foreground sm:text-4xl lg:text-5xl">
              Página em construção
            </Heading>

            <Text className="text-base leading-relaxed text-shell-foreground/75 sm:text-lg">
              Esta página ainda está sendo preparada e estará disponível em breve. Enquanto isso,
              você pode voltar para onde estava ou ir para a página inicial.
            </Text>
          </Box>

          <Box className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {canGoBack && (
              <Button
                className={cn(actionClassName, secondaryActionClassName)}
                type="button"
                variant="ghost"
                onClick={handleGoBack}
              >
                <ArrowLeftIcon className="size-4" />
                Voltar
              </Button>
            )}

            <Link className={cn(actionClassName, primaryActionClassName)} to="/">
              <HouseIcon className="size-4" />
              Ir para o início
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
