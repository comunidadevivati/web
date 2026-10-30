import { Box, Heading, Spinner, Text } from '@/components/ui';
import { useLeadershipDashboardViewModel } from '@/features/departments/presentation/view-models/leadership-dashboard.view-model';
import { Link } from '@tanstack/react-router';
import { ChevronRightIcon, ClipboardListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Painel do departamento de Liderança: atalhos para as ferramentas do departamento.
export const LeadershipDashboardView = () => {
  const { formsCard } = useLeadershipDashboardViewModel();

  const { t } = useTranslation('departments');

  return (
    <Box className="grid gap-8">
      <Box>
        <Text className="text-xs font-semibold tracking-[0.18em] text-primary-strong uppercase">
          {t('eyebrow')}
        </Text>

        <Heading className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {t('leadership.title')}
        </Heading>

        <Text className="mt-1 text-muted-foreground">{t('leadership.subtitle')}</Text>
      </Box>

      <Box className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          className="
            group relative grid gap-4 overflow-hidden rounded-xl border border-chart-1/20
            surface-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1
            hover:shadow-xl
          "
          to="/departamentos/lideranca/formularios"
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
                {t('leadership.cards.forms.title')}
              </Text>

              {formsCard.isLoading ? (
                <Spinner className="size-6 text-chart-1" />
              ) : (
                <Text className="text-3xl font-semibold tracking-tight text-chart-1">
                  {formsCard.total ?? '—'}
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
              <ClipboardListIcon className="size-5" />
            </Box>
          </Box>

          <Text className="relative text-xs text-muted-foreground">
            {formsCard.details ?? t('leadership.cards.forms.description')}
          </Text>

          <Box className="relative flex items-center gap-1 text-sm font-medium text-primary-strong">
            {t('leadership.cards.forms.open')}

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
