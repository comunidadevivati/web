import { Box, Text } from '@/components/ui';
import type { BacklogCard } from '@/features/backlog/domain/backlog-card';
import { formatBacklogDate } from '@/features/backlog/presentation/models/backlog.model';
import { useTranslation } from 'react-i18next';

type BacklogCardDatesProps = {
  card: Pick<BacklogCard, 'createdAt' | 'updatedAt' | 'statusChangedAt'>;
};

// Datas mantidas pelo servidor: só leitura, no quadro e no diálogo de edição.
export const BacklogCardDates = ({ card }: BacklogCardDatesProps) => {
  const { i18n, t } = useTranslation('backlog');

  const dates = [
    { label: t('card.createdAt'), value: card.createdAt },
    { label: t('card.updatedAt'), value: card.updatedAt },
    { label: t('card.statusChangedAt'), value: card.statusChangedAt },
  ];

  return (
    <Box className="grid gap-0.5">
      {dates.map(({ label, value }) => (
        <Box key={label} className="flex items-baseline justify-between gap-2">
          <Text className="text-xs">{label}</Text>

          <Text className="text-xs tabular-nums">{formatBacklogDate(value, i18n.language)}</Text>
        </Box>
      ))}
    </Box>
  );
};
