import { Box, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type CardSectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

// Cabeçalho de seção dentro de um Card: ícone em destaque, título e descrição, com divisória.
export const CardSectionHeader = ({
  className,
  description,
  icon: Icon,
  title,
}: CardSectionHeaderProps) => {
  return (
    <CardHeader className={cn('border-b border-border/60', className)}>
      <Box className="flex items-center gap-3">
        <Box
          className="
            flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10
            text-primary-strong
          "
        >
          <Icon aria-hidden="true" className="size-5" />
        </Box>

        <Box>
          <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>

          <CardDescription>{description}</CardDescription>
        </Box>
      </Box>
    </CardHeader>
  );
};
