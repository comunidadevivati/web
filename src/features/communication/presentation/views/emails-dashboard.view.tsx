import { Box, Heading, Spinner, Text } from '@/components/ui';
import { useEmailsDashboardViewModel } from '@/features/communication/presentation/view-models/emails-dashboard.view-model';
import { Link } from '@tanstack/react-router';
import { ChevronRightIcon, UsersRoundIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Painel de E-mails (Comunicação): atalhos para as ferramentas de e-mail.
export const EmailsDashboardView = () => {
  const { groupsCard } = useEmailsDashboardViewModel();

  const { t } = useTranslation('communication');

  return (
    <Box className="grid gap-8">
      <Box>
        <Text className="text-xs font-semibold tracking-[0.18em] text-primary-strong uppercase">
          {t('eyebrow')}
        </Text>

        <Heading className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {t('dashboard.title')}
        </Heading>

        <Text className="mt-1 text-muted-foreground">{t('dashboard.subtitle')}</Text>
      </Box>

      <Box className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          className="
            group relative grid gap-4 overflow-hidden rounded-xl border border-chart-1/20
            surface-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1
            hover:shadow-xl
          "
          to="/comunicacao/emails/grupos"
        >
          <Box aria-hidden="true" className="absolute top-0 left-0 h-1 w-full bg-chart-1" />

          <Box
            aria-hidden="true"
            className="
              absolute top-0 right-0 size-28 translate-x-10 -translate-y-10 rounded-full
              bg-chart-1/10 blur-2xl
            "
          />

          <Box className="relative flex items-start justify-between gap-3">
            <Box className="grid gap-2">
              <Text className="font-medium text-muted-foreground">
                {t('dashboard.cards.groups.title')}
              </Text>

              {groupsCard.isLoading ? (
                <Spinner className="size-6 text-chart-1" />
              ) : (
                <Text className="text-3xl font-semibold tracking-tight text-chart-1">
                  {groupsCard.total ?? '—'}
                </Text>
              )}
            </Box>

            <Box
              aria-hidden="true"
              className="
                flex size-12 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1
                transition-transform duration-300 group-hover:scale-110
              "
            >
              <UsersRoundIcon className="size-5" />
            </Box>
          </Box>

          <Text className="relative text-xs text-muted-foreground">
            {groupsCard.details ?? t('dashboard.cards.groups.description')}
          </Text>

          <Box className="relative flex items-center gap-1 text-sm font-medium text-primary-strong">
            {t('dashboard.cards.groups.open')}

            <ChevronRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Box>
        </Link>
      </Box>
    </Box>
  );
};
