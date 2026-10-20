import { Box, Button, Progress, Text } from '@/components/ui';
import type { UploadItem } from '@/features/gallery/presentation/models/gallery.model';
import { cn } from '@/lib/utils';
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type UploadListProps = {
  items: UploadItem[];
  canClear: boolean;
  onClear: () => void;
};

// Andamento de cada arquivo enviado nesta sessão da página.
export const UploadList = ({ canClear, items, onClear }: UploadListProps) => {
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
        {items.map(({ detail, failure, key, name, progress, stage }) => (
          <Box key={key} className="grid gap-1.5">
            <Box className="flex min-w-0 items-center gap-2">
              {stage === 'done' && (
                <CircleCheckIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-success-strong"
                />
              )}

              {stage === 'failed' && (
                <CircleAlertIcon aria-hidden="true" className="size-4 shrink-0 text-destructive" />
              )}

              <Text className="min-w-0 flex-1 truncate text-sm">{name}</Text>

              <Text className="shrink-0 text-xs text-muted-foreground">
                {t(`uploads.stage.${stage}`, { percent: Math.round(progress * 100) })}
              </Text>
            </Box>

            {stage === 'failed' ? (
              <Text className="text-xs text-destructive">
                {detail ?? (failure ? t(`uploads.failure.${failure}`) : '')}
              </Text>
            ) : (
              <Progress
                aria-label={name}
                indicatorClassName={cn(stage === 'done' && 'bg-success')}
                value={Math.round(progress * 100)}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
