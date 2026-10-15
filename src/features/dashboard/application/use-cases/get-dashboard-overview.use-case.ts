import type { DashboardGateway } from '@/features/dashboard/domain/dashboard-overview';
import { dashboardMockGateway } from '@/features/dashboard/infrastructure/mock/dashboard-mock.gateway';

export const getDashboardOverviewUseCase = (gateway: DashboardGateway = dashboardMockGateway) => {
  return gateway.getOverview();
};
