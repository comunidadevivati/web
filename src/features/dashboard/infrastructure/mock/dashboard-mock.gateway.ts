import type { DashboardGateway } from '@/features/dashboard/domain/dashboard-overview';

const DAY_IN_MS = 86_400_000;

const daysAgo = (days: number) => {
  return new Date(Date.now() - days * DAY_IN_MS).toISOString();
};

// Dados temporários enquanto o BFF não expõe a visão geral do dashboard. Substituir por um gateway
// HTTP (bffClient) com o mesmo contrato quando o endpoint existir; a ViewModel não muda.
export const dashboardMockGateway: DashboardGateway = {
  getOverview: async () => {
    return {
      indicators: {
        members: 248,
        visitors: 34,
        events: 6,
        ministries: 12,
      },
      upcomingEvents: [
        { id: '1', title: 'Culto de Celebração', startsAt: '2026-10-11T19:00:00' },
        { id: '2', title: 'Encontro de Líderes', startsAt: '2026-10-14T19:30:00' },
        { id: '3', title: 'Conferência de Famílias', startsAt: '2026-10-17T18:00:00' },
      ],
      recentActivities: [
        { id: '1', type: 'newMember', occurredAt: daysAgo(0) },
        { id: '2', type: 'newVisitor', occurredAt: daysAgo(0) },
        { id: '3', type: 'eventUpdated', occurredAt: daysAgo(1) },
      ],
    };
  },
};
