import { getAuthSessionUseCase } from '@/features/auth/application/use-cases/get-auth-session.use-case';
import { queryOptions } from '@tanstack/react-query';

// Sessão do BFF (GET /auth/me) como server state. Usada pelos guards das rotas e pelas ViewModels.
// O token CSRF fica somente aqui, em memória.
export const authSessionQueryOptions = queryOptions({
  queryKey: ['auth', 'session'],
  queryFn: () => getAuthSessionUseCase(),
  staleTime: 60_000,
  retry: false,
});
