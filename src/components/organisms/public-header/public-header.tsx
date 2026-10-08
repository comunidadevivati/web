import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { ThemeToggle } from '@/components/molecules';
import { Box, Button, buttonVariants, Image, Text } from '@/components/ui';
import { Link, type LinkProps } from '@tanstack/react-router';
import { cn } from 'cn';
import { LogInIcon, MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

type MenuItem = {
  label: string;
  to: LinkProps['to'];
};

const menuItems: MenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'História', to: '/historia' },
  { label: 'Eventos', to: '/eventos' },
  { label: 'Contato', to: '/contato' },
];

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Box
      className="
        sticky top-0 z-40 border-b border-header-border bg-header/95 shadow-elevated backdrop-blur
      "
      role="banner"
    >
      <Box
        className="
          mx-auto flex h-16 w-full max-w-360 items-center justify-between px-4 sm:px-6 md:h-18
          lg:px-8
        "
      >
        <Link
          aria-label="Ir para a página inicial"
          className="
            flex shrink-0 items-center rounded-lg transition-opacity duration-200 hover:opacity-85
            focus-visible:ring-2 focus-visible:ring-header-accent focus-visible:outline-none
          "
          to="/"
        >
          <Image
            alt="Comunidade Viva e Eficaz"
            className="h-8 w-auto max-w-40 object-contain sm:h-9 sm:max-w-48 md:h-10 md:max-w-52"
            src={logoVivaWhite}
          />
        </Link>

        <Button
          aria-controls="public-header-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          className="
            size-11 text-header-foreground/75 hover:bg-header-accent/10
            hover:text-header-accent-foreground aria-expanded:bg-header-accent/10
            aria-expanded:text-header-accent-foreground md:hidden
            [&_svg:not([class*='size-'])]:size-5
          "
          size="icon-lg"
          type="button"
          variant="ghost"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </Button>

        <Box
          aria-label="Menu principal"
          className={cn(
            `
              absolute inset-x-0 top-full flex-col gap-1 border-b border-header-border bg-header
              px-4 py-4 shadow-elevated-lg sm:px-6
            `,
            `
              md:static md:flex md:flex-row md:items-center md:gap-0.5 md:border-0 md:bg-transparent
              md:p-0 md:shadow-none lg:gap-1
            `,
            isMenuOpen ? 'flex' : 'hidden',
          )}
          id="public-header-menu"
          role="navigation"
        >
          {menuItems.map(({ label, to }) => (
            <Link
              key={label}
              activeOptions={{ exact: true }}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                `
                  h-11 justify-start px-3 text-base font-medium text-header-foreground/75
                  hover:bg-header-accent/10 hover:text-header-accent-foreground
                  data-[status=active]:bg-header-accent/10
                  data-[status=active]:text-header-accent-foreground md:h-10 md:justify-center
                  md:text-sm
                `,
              )}
              to={to}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <Link
            className="
              mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg border
              border-header-accent/40 bg-header-accent/10 px-4 text-base font-semibold
              text-header-accent-foreground transition-all duration-200 hover:border-header-accent
              hover:bg-header-accent hover:text-header focus-visible:ring-2
              focus-visible:ring-header-accent focus-visible:outline-none md:mt-0 md:ml-2 md:h-10
              md:text-sm lg:ml-3
            "
            to="/login"
          >
            <LogInIcon className="size-4" />
            Login
          </Link>

          <Box
            className="
              mt-2 flex items-center justify-between gap-3 border-t border-header-border pt-3
              md:mt-0 md:ml-2 md:border-0 md:pt-0 lg:ml-3
            "
          >
            <Text className="text-sm font-medium text-header-foreground/75 md:hidden">Tema</Text>

            <ThemeToggle tone="header" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
