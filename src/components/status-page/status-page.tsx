import { PublicHeader } from '@/components/public-header/public-header';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
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
                text-xs font-semibold tracking-widest text-shell-accent-foreground uppercase
                sm:text-sm
              "
            >
              {eyebrow}
            </Text>

            <Heading className="text-3xl text-shell-foreground sm:text-4xl lg:text-5xl">
              {title}
            </Heading>

            <Text className="text-base leading-relaxed text-shell-foreground/75 sm:text-lg">
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
    </Box>
  );
};
