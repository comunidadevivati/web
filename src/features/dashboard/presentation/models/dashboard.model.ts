export type DashboardSummary = {
  label: string;
  value: number;
  description: string;
  icon: 'members' | 'visitors' | 'events' | 'ministries';
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
