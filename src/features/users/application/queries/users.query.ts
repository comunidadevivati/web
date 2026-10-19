import { listUsersUseCase } from '@/features/users/application/use-cases/list-users.use-case';
import type { UserFilters } from '@/features/users/domain/user';
import { infiniteQueryOptions } from '@tanstack/react-query';

// Raiz das chaves da gestão de usuários: invalidada após qualquer alteração.
export const USERS_QUERY_KEY = ['users'] as const;

// Lista paginada por cursor com filtros de situação, verificação do e-mail e nome/e-mail.
export const usersQueryOptions = (filters: Omit<UserFilters, 'cursor'>) => {
  return infiniteQueryOptions({
    queryKey: [...USERS_QUERY_KEY, 'list', filters],
    queryFn: ({ pageParam }) => listUsersUseCase({ ...filters, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
};
