import { LoginView } from '@/features/auth/presentation/views/login.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginView,
});
