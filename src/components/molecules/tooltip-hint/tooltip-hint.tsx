import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import type { ComponentProps, ReactElement } from 'react';

type TooltipHintProps = {
  label: string;
  children: ReactElement;
  side?: ComponentProps<typeof TooltipContent>['side'];
  isEnabled?: boolean;
};

// Dica visual (tooltip do shadcn) sobre um elemento interativo, ex.: botões só com ícone.
// O elemento continua responsável pelo próprio nome acessível (aria-label).
export const TooltipHint = ({ children, isEnabled = true, label, side }: TooltipHintProps) => {
  if (!isEnabled) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={children} />

      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
};
