import { DashboardView } from '@/features/dashboard/presentation/views/dashboard.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardView,
});
