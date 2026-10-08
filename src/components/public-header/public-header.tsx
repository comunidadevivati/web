import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { Box } from '@/components/ui/box';
import { Button, buttonVariants } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Link, type LinkProps } from '@tanstack/react-router';
import { cn } from 'cn';
import { LogInIcon, MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

type MenuItem = {
  label: string;
  to?: LinkProps['to'];
};

// Itens sem `to` ainda não possuem página.
const menuItems: MenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'História' },
  { label: 'Eventos' },
  { label: 'Contato', to: '/contato' },
];

const menuItemClassName = `
  h-11 justify-start px-3 text-base font-medium text-shell-foreground/75 hover:bg-shell-accent/10
  hover:text-shell-accent-foreground data-[status=active]:bg-shell-accent/10
  data-[status=active]:text-shell-accent-foreground md:h-10 md:justify-center md:text-sm
`;

const loginClassName = `
  mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-shell-accent/40
  bg-shell-accent/10 px-4 text-base font-semibold text-shell-accent-foreground transition-all
  duration-200 hover:border-shell-accent hover:bg-shell-accent hover:text-shell focus-visible:ring-2
  focus-visible:ring-shell-accent focus-visible:outline-none md:mt-0 md:ml-2 md:h-10 md:text-sm
  lg:ml-3
`;

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Box
      className="
        sticky top-0 z-40 border-b border-shell-border bg-shell/95 shadow-elevated backdrop-blur
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
            focus-visible:ring-2 focus-visible:ring-shell-accent focus-visible:outline-none
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
            size-11 text-shell-foreground/75 hover:bg-shell-accent/10
            hover:text-shell-accent-foreground md:hidden [&_svg:not([class*='size-'])]:size-5
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
              absolute inset-x-0 top-full flex-col gap-1 border-b border-shell-border bg-shell px-4
              py-4 shadow-elevated-lg sm:px-6
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
          {menuItems.map(({ label, to }) =>
            to ? (
              <Link
                key={label}
                activeOptions={{ exact: true }}
                className={cn(buttonVariants({ variant: 'ghost' }), menuItemClassName)}
                to={to}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ) : (
              <Button key={label} className={menuItemClassName} type="button" variant="ghost">
                {label}
              </Button>
            ),
          )}

          <Link className={loginClassName} to="/login">
            <LogInIcon className="size-4" />
            Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
