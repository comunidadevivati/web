import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { dashboardOverviewQueryOptions } from '@/features/dashboard/application/queries/dashboard-overview.query';
import {
  DASHBOARD_INDICATORS,
  type DashboardActivity,
  type DashboardEvent,
  type DashboardSummary,
} from '@/features/dashboard/presentation/models/dashboard.model';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const DAY_IN_MS = 86_400_000;

const capitalize = (value: string) => {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
};

// Diferença em dias de calendário entre a data informada e hoje (0 = hoje, -1 = ontem).
const getDayOffset = (date: Date) => {
  const startOfDay = (value: Date) => {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  };

  return Math.round((startOfDay(date) - startOfDay(new Date())) / DAY_IN_MS);
};

export const useDashboardViewModel = () => {
  const { i18n, t } = useTranslation('dashboard');

  // Conta sem e-mail verificado: não carrega nenhuma informação, só o aviso.
  const { data: session } = useQuery(authSessionQueryOptions);

  const isEmailVerified = session?.user.emailVerified ?? false;

  const { data, isError, isFetching, isPending, refetch } = useQuery({
    ...dashboardOverviewQueryOptions,
    enabled: isEmailVerified,
  });

  const { language } = i18n;

  const dateFormatter = new Intl.DateTimeFormat(language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat(language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const relativeFormatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });

  // Sem dados (carregando ou com erro), não há indicadores para exibir.
  const indicators = data ? DASHBOARD_INDICATORS : [];

  const summaries: DashboardSummary[] = indicators.map((icon) => ({
    icon,
    value: data?.indicators[icon] ?? 0,
    label: t(`summaries.${icon}.label`),
    description: t(`summaries.${icon}.description`),
  }));

  const events: DashboardEvent[] = (data?.upcomingEvents ?? []).map(({ id, startsAt, title }) => {
    const date = new Date(startsAt);

    return {
      id,
      title,
      date: dateFormatter.format(date),
      time: timeFormatter.format(date),
    };
  });

  const activities: DashboardActivity[] = (data?.recentActivities ?? []).map(
    ({ id, occurredAt, type }) => ({
      id,
      description: t(`recentActivities.items.${type}`),
      date: capitalize(relativeFormatter.format(getDayOffset(new Date(occurredAt)), 'day')),
    }),
  );

  const retry = () => {
    void refetch();
  };

  return {
    activities,
    events,
    hasError: isError,
    isEmailVerified,
    isLoading: isEmailVerified && isPending,
    isRetrying: isFetching,
    retry,
    summaries,
  };
};
