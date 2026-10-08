import { AppFooter } from '@/components/organisms/app-footer/app-footer';
import { PublicHeader } from '@/components/organisms/public-header/public-header';
import { Box, Button, Heading, Image, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon, HouseIcon } from 'lucide-react';

const actionClassName = cn(`
  inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border px-5 text-base
  font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring
  focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none
  sm:w-auto
`);

const primaryActionClassName = cn(`
  border-primary bg-primary text-primary-foreground hover:border-primary/80 hover:bg-primary/80
`);

const secondaryActionClassName = cn(`
  border-primary/40 bg-primary/10 text-primary-strong hover:border-primary hover:bg-primary/20
  hover:text-primary-strong
`);

export type StatusPageImage = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

type StatusPageProps = {
  image: StatusPageImage;
  eyebrow: string;
  title: string;
  description: string;
  canGoBack: boolean;
  onGoBack: () => void;
};

// Página pública de status (em construção, não encontrada etc.) com saída para trás ou para o início.
export const StatusPage = ({
  canGoBack,
  description,
  eyebrow,
  image,
  onGoBack,
  title,
}: StatusPageProps) => {
  return (
    <Box className="flex min-h-dvh flex-col overflow-x-clip bg-background">
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
            className={cn(
              'h-auto max-h-[36dvh] w-full max-w-md object-contain sm:max-w-lg lg:max-w-xl',
              image.className,
            )}
            height={image.height}
            src={image.src}
            width={image.width}
          />

          <Box className="grid max-w-xl gap-3">
            <Text
              className="
                text-xs font-semibold tracking-widest text-primary-strong uppercase sm:text-sm
              "
            >
              {eyebrow}
            </Text>

            <Heading className="text-3xl text-foreground sm:text-4xl lg:text-5xl">{title}</Heading>

            <Text className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </Text>
          </Box>

          <Box className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {canGoBack && (
              <Button
                className={cn(actionClassName, secondaryActionClassName)}
                type="button"
                variant="ghost"
                onClick={onGoBack}
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

      <AppFooter />
    </Box>
  );
};
