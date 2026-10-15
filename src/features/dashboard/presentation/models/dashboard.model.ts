import type { DashboardIndicator } from '@/features/dashboard/domain/dashboard-overview';

export const DASHBOARD_INDICATORS = [
  'members',
  'visitors',
  'events',
  'ministries',
] as const satisfies readonly DashboardIndicator[];

export type DashboardSummary = {
  label: string;
  value: number;
  description: string;
  icon: DashboardIndicator;
};

export type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
};

export type DashboardActivity = {
  id: string;
  description: string;
  date: string;
};
