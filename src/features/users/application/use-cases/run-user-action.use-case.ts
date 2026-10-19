import type { UserAction, UsersGateway } from '@/features/users/domain/user';
import { usersHttpGateway } from '@/features/users/infrastructure/http/users-http.gateway';

// Suspender (bloqueia o login), reativar ou excluir definitivamente (somente não verificada).
export const runUserActionUseCase = async (
  csrfToken: string,
  id: string,
  action: UserAction,
  gateway: UsersGateway = usersHttpGateway,
) => {
  if (action === 'delete') {
    await gateway.deleteUser(csrfToken, id);

    return;
  }

  await (action === 'suspend'
    ? gateway.suspendUser(csrfToken, id)
    : gateway.reactivateUser(csrfToken, id));
};
