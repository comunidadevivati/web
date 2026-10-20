import { Box, Text } from '@/components/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type DetailItemProps = {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
};

// Informação de um registro com ícone e rótulo (ex.: CNPJ, telefone, endereço).
export const DetailItem = ({ children, icon: Icon, label }: DetailItemProps) => {
  return (
    <Box className="flex min-w-0 items-start gap-3">
      <Box
        aria-hidden="true"
        className="
          flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10
          text-primary-strong
        "
      >
        <Icon className="size-4" />
      </Box>

      <Box className="grid min-w-0 gap-1">
        <Text className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </Text>

        <Box className="grid min-w-0 gap-0.5 text-sm leading-snug break-words text-foreground">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
