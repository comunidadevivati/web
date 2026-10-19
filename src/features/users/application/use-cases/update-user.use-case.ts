import type { UserChanges, UsersGateway } from '@/features/users/domain/user';
import { usersHttpGateway } from '@/features/users/infrastructure/http/users-http.gateway';

// Trocar o e-mail volta a conta para "não verificada" e envia um novo link ao endereço novo.
export const updateUserUseCase = (
  csrfToken: string,
  id: string,
  changes: UserChanges,
  gateway: UsersGateway = usersHttpGateway,
) => {
  return gateway.updateUser(csrfToken, id, changes);
};
