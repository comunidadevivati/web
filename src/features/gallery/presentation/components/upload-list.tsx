import { Box, Button, Progress, Text } from '@/components/ui';
import {
  isRetryableUpload,
  type UploadItem,
} from '@/features/gallery/presentation/models/gallery.model';
import { cn } from '@/lib/utils';
import { CircleAlertIcon, CircleCheckIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type UploadListProps = {
  items: UploadItem[];
  canClear: boolean;
  // Reenvios ficam bloqueados enquanto outro envio está em andamento.
  canRetry: boolean;
  onClear: () => void;
  onRetry: (key: string) => void;
};

// Andamento de cada arquivo enviado nesta sessão da página.
export const UploadList = ({ canClear, canRetry, items, onClear, onRetry }: UploadListProps) => {
  const { t } = useTranslation('gallery');

  if (items.length === 0) {
    return null;
  }

  return (
    <Box className="grid gap-3 rounded-xl border border-border p-4">
      <Box className="flex items-center justify-between gap-3">
        <Text className="text-sm font-semibold text-foreground">{t('uploads.title')}</Text>

        {canClear && (
          <Button size="sm" type="button" variant="ghost" onClick={onClear}>
            {t('uploads.clear')}
          </Button>
        )}
      </Box>

      <Box aria-live="polite" className="grid max-h-72 gap-3 overflow-y-auto pr-1">
        {items.map((item) => {
          const { detail, failure, key, name, progress, stage } = item;

          return (
            <Box key={key} className="grid gap-1.5">
              <Box className="flex min-w-0 items-center gap-2">
                {stage === 'done' && (
                  <CircleCheckIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-success-strong"
                  />
                )}

                {stage === 'failed' && (
                  <CircleAlertIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-destructive"
                  />
                )}

                <Text className="min-w-0 flex-1 truncate text-sm">{name}</Text>

                <Text className="shrink-0 text-xs text-muted-foreground">
                  {t(`uploads.stage.${stage}`, { percent: Math.round(progress * 100) })}
                </Text>
              </Box>

              {stage === 'failed' ? (
                <Box className="flex items-start justify-between gap-3">
                  <Text className="min-w-0 flex-1 text-xs text-destructive">
                    {detail ?? (failure ? t(`uploads.failure.${failure}`) : '')}
                  </Text>

                  {isRetryableUpload(item) && (
                    <Button
                      aria-label={t('uploads.retryFile', { name })}
                      className="shrink-0"
                      disabled={!canRetry}
                      size="xs"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        onRetry(key);
                      }}
                    >
                      <RefreshCwIcon data-icon="inline-start" />
                      {t('uploads.retry')}
                    </Button>
                  )}
                </Box>
              ) : (
                <Progress
                  aria-label={name}
                  indicatorClassName={cn(stage === 'done' && 'bg-success')}
                  value={Math.round(progress * 100)}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
