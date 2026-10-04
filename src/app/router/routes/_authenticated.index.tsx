import { HomeView } from '@/features/home/presentation/views/home.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: HomeView,
});
