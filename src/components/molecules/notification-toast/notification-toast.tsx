import {
  Box,
  Progress,
  Text,
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastTitle,
  useToastManager,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { TOAST_DURATION_MS, type NotificationType } from '@/shared/feedback/notify';
import { CircleCheckIcon, CircleXIcon } from 'lucide-react';
import { useEffect, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

type NotificationToastProps = {
  toast: ComponentProps<typeof Toast>['toast'];
  durationMs?: number;
};

const TICK_MS = 100;

const accentClassNames: Record<NotificationType, string> = {
  success: cn('before:bg-success'),
  error: cn('before:bg-destructive'),
};

const iconClassNames: Record<NotificationType, string> = {
  success: cn('text-success-strong'),
  error: cn('text-destructive-strong'),
};

const progressClassNames: Record<NotificationType, string> = {
  success: cn('bg-success'),
  error: cn('bg-destructive'),
};

const getType = (type?: string): NotificationType => {
  return type === 'error' ? 'error' : 'success';
};

// Toast de retorno (sucesso ou erro): ícone, título, subtítulo, botão de fechar e barra com a
// contagem regressiva até fechar sozinho. A contagem pausa com o mouse ou o foco no toast e com a
// aba em segundo plano (WCAG 2.2.1), para dar tempo de ler.
export const NotificationToast = ({
  durationMs = TOAST_DURATION_MS,
  toast,
}: NotificationToastProps) => {
  const { close } = useToastManager();

  const { t } = useTranslation();

  const [remainingMs, setRemainingMs] = useState(durationMs);

  const [isHovered, setIsHovered] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const [isPageHidden, setIsPageHidden] = useState(() => document.hidden);

  const isPaused = isHovered || isFocused || isPageHidden;

  const type = getType(toast.type);

  const Icon = type === 'error' ? CircleXIcon : CircleCheckIcon;

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    let lastTick = performance.now();

    const intervalId = window.setInterval(() => {
      const now = performance.now();

      const elapsed = now - lastTick;

      lastTick = now;

      setRemainingMs((remaining) => Math.max(0, remaining - elapsed));
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  useEffect(() => {
    if (remainingMs <= 0) {
      close(toast.id);
    }
  }, [close, remainingMs, toast.id]);

  const remainingSeconds = Math.ceil(remainingMs / 1000);

  return (
    <Toast
      className={cn(
        'before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[""]',
        accentClassNames[type],
      )}
      data-type={type}
      toast={toast}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      onFocus={() => setIsFocused(true)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <ToastContent className="pl-5">
        <Box className="flex items-start gap-3">
          <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', iconClassNames[type])} />

          <Box className="grid min-w-0 flex-1 gap-1">
            <ToastTitle />

            {toast.description && <ToastDescription />}
          </Box>

          <ToastClose label={t('toast.close')} />
        </Box>

        <Box aria-hidden="true" className="flex items-center gap-3">
          <Progress
            className="flex-1"
            indicatorClassName={cn(
              'transition-[width] duration-100 ease-linear',
              progressClassNames[type],
            )}
            value={(remainingMs / durationMs) * 100}
          />

          <Text className="w-6 text-right text-xs text-foreground/85 tabular-nums">
            {t('toast.secondsLeft', { seconds: remainingSeconds })}
          </Text>
        </Box>
      </ToastContent>
    </Toast>
  );
};
