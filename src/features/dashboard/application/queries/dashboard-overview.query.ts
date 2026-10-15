import { getDashboardOverviewUseCase } from '@/features/dashboard/application/use-cases/get-dashboard-overview.use-case';
import { queryOptions } from '@tanstack/react-query';

export const dashboardOverviewQueryOptions = queryOptions({
  queryKey: ['dashboard', 'overview'],
  queryFn: () => getDashboardOverviewUseCase(),
});
