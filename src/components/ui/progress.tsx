import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { cn } from 'cn';

type ProgressProps = ProgressPrimitive.Root.Props & {
  // Classes do preenchimento (ex.: cor conforme o estado exibido).
  indicatorClassName?: string;
};

export const Progress = ({
  className,
  children,
  indicatorClassName,
  value,
  ...props
}: ProgressProps) => {
  return (
    <ProgressPrimitive.Root
      className={cn('flex flex-wrap gap-3', className)}
      data-slot="progress"
      value={value}
      {...props}
    >
      {children}

      <ProgressTrack>
        <ProgressIndicator className={indicatorClassName} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
};

export const ProgressTrack = ({ className, ...props }: ProgressPrimitive.Track.Props) => {
  return (
    <ProgressPrimitive.Track
      className={cn(
        'relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted',
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
};

export const ProgressIndicator = ({ className, ...props }: ProgressPrimitive.Indicator.Props) => {
  return (
    <ProgressPrimitive.Indicator
      className={cn('h-full bg-primary transition-all', className)}
      data-slot="progress-indicator"
      {...props}
    />
  );
};

export const ProgressLabel = ({ className, ...props }: ProgressPrimitive.Label.Props) => {
  return (
    <ProgressPrimitive.Label
      className={cn('text-sm font-medium', className)}
      data-slot="progress-label"
      {...props}
    />
  );
};

export const ProgressValue = ({ className, ...props }: ProgressPrimitive.Value.Props) => {
  return (
    <ProgressPrimitive.Value
      className={cn('ml-auto text-sm text-muted-foreground tabular-nums', className)}
      data-slot="progress-value"
      {...props}
    />
  );
};
