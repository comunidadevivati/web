import type { Translations } from '@/app/i18n/i18n.model';
import type {
  DashboardActivity,
  DashboardEvent,
  DashboardSummary,
} from '@/features/dashboard/presentation/models/dashboard.model';
import { useTranslation } from 'react-i18next';

type EventKey = keyof Translations['dashboard']['upcomingEvents']['items'];

type ActivityKey = keyof Translations['dashboard']['recentActivities']['items'];

// Mocks temporários: textos por chave de tradução e datas em ISO, formatadas no idioma atual.
const summaryMocks: Pick<DashboardSummary, 'icon' | 'value'>[] = [
  { icon: 'members', value: 248 },
  { icon: 'visitors', value: 34 },
  { icon: 'events', value: 6 },
  { icon: 'ministries', value: 12 },
];

const eventMocks: { id: string; key: EventKey; startsAt: string }[] = [
  { id: '1', key: 'celebration', startsAt: '2026-10-11T19:00:00' },
  { id: '2', key: 'leaders', startsAt: '2026-10-14T19:30:00' },
  { id: '3', key: 'families', startsAt: '2026-10-17T18:00:00' },
];

const activityMocks: { id: string; key: ActivityKey; daysAgo: number }[] = [
  { id: '1', key: 'newMember', daysAgo: 0 },
  { id: '2', key: 'newVisitor', daysAgo: 0 },
  { id: '3', key: 'eventUpdated', daysAgo: 1 },
];

const capitalize = (value: string) => {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
};

export const useDashboardViewModel = () => {
  const { i18n, t } = useTranslation('dashboard');

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

  const summaries: DashboardSummary[] = summaryMocks.map(({ icon, value }) => ({
    icon,
    value,
    label: t(`summaries.${icon}.label`),
    description: t(`summaries.${icon}.description`),
  }));

  const events: DashboardEvent[] = eventMocks.map(({ id, key, startsAt }) => {
    const date = new Date(startsAt);

    return {
      id,
      title: t(`upcomingEvents.items.${key}`),
      date: dateFormatter.format(date),
      time: timeFormatter.format(date),
    };
  });

  const activities: DashboardActivity[] = activityMocks.map(({ daysAgo, id, key }) => ({
    id,
    description: t(`recentActivities.items.${key}`),
    date: capitalize(relativeFormatter.format(-daysAgo, 'day')),
  }));

  return {
    activities,
    events,
    summaries,
  };
};
