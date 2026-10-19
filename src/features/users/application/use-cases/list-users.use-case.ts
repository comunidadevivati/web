import type { UserFilters, UsersGateway } from '@/features/users/domain/user';
import { usersHttpGateway } from '@/features/users/infrastructure/http/users-http.gateway';

export const listUsersUseCase = (
  filters: UserFilters,
  gateway: UsersGateway = usersHttpGateway,
) => {
  return gateway.listUsers(filters);
};
