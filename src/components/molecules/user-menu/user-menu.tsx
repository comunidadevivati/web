import {
  Avatar,
  AvatarFallback,
  Box,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const headerFallbackClassName = cn(
  'bg-header-accent/15 font-semibold text-header-accent-foreground',
);

const greetingClassName = cn(
  'hidden max-w-64 truncate text-sm font-medium text-header-foreground/80 lg:block',
);

type UserMenuProps = {
  // Exibido na saudação do header. Enquanto não há API, é o e-mail do usuário.
  greetingName: string;
  name: string;
  email: string;
  initials: string;
  onLogout: () => void;
};

// Saudação, separador e avatar do usuário logado (por enquanto, com as iniciais) que abre o menu da conta.
export const UserMenu = ({ email, greetingName, initials, name, onLogout }: UserMenuProps) => {
  const { t } = useTranslation();

  return (
    <Box className="flex min-w-0 items-center gap-3">
      <Text className={greetingClassName}>{t('navigation.greeting', { name: greetingName })}</Text>

      <Box aria-hidden="true" className="hidden h-6 w-px bg-header-border lg:block" />

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t('navigation.accountMenu')}
          className="
            group flex cursor-pointer items-center gap-1.5 rounded-full p-1 pr-2
            text-header-foreground/70 transition-colors duration-200 hover:bg-header-accent/10
            hover:text-header-accent-foreground focus-visible:ring-2
            focus-visible:ring-header-accent focus-visible:outline-none
            data-popup-open:bg-header-accent/15 data-popup-open:text-header-accent-foreground
          "
        >
          <Avatar className="size-9 after:border-header-accent/40">
            <AvatarFallback className={headerFallbackClassName}>{initials}</AvatarFallback>
          </Avatar>

          {/* Seta para baixo quando fechado; gira para cima quando o menu está aberto. */}
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-data-popup-open:rotate-180"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
              <Avatar size="lg">
                <AvatarFallback className="bg-primary/15 font-semibold text-primary-strong">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Box className="grid min-w-0 gap-1">
                <Text className="truncate text-sm font-semibold text-popover-foreground">
                  {name}
                </Text>

                <Text className="truncate text-xs text-muted-foreground">{email}</Text>
              </Box>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="px-2 py-2" onClick={onLogout}>
            <LogOutIcon />
            {t('navigation.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};
