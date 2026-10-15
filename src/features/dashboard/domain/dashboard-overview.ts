export type DashboardIndicator = 'members' | 'visitors' | 'events' | 'ministries';

export type DashboardUpcomingEvent = {
  id: string;
  // Nome do evento como cadastrado (conteúdo, não texto de interface).
  title: string;
  // Data e hora de início em ISO 8601.
  startsAt: string;
};

export type DashboardActivityType = 'newMember' | 'newVisitor' | 'eventUpdated';

export type DashboardRecentActivity = {
  id: string;
  type: DashboardActivityType;
  // Data e hora em ISO 8601.
  occurredAt: string;
};

// Visão geral exibida no dashboard. O contrato definitivo depende do endpoint no BFF.
export type DashboardOverview = {
  indicators: Record<DashboardIndicator, number>;
  upcomingEvents: DashboardUpcomingEvent[];
  recentActivities: DashboardRecentActivity[];
};

export interface DashboardGateway {
  getOverview: () => Promise<DashboardOverview>;
}
