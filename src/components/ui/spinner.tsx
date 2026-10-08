import { cn } from 'cn';
import { Loader2Icon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

type SpinnerProps = ComponentProps<'svg'>;

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  const { t } = useTranslation();

  return (
    <Loader2Icon
      aria-label={t('loading')}
      className={cn('size-4 animate-spin', className)}
      data-slot="spinner"
      role="status"
      {...props}
    />
  );
};
