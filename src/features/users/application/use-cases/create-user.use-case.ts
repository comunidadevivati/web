import type { NewUser, UsersGateway } from '@/features/users/domain/user';
import { usersHttpGateway } from '@/features/users/infrastructure/http/users-http.gateway';

// Mesmo cadastro da tela de login, sem abrir sessão para a nova conta: ela recebe o link de
// verificação por e-mail.
export const createUserUseCase = (
  csrfToken: string,
  user: NewUser,
  gateway: UsersGateway = usersHttpGateway,
) => {
  return gateway.createUser(csrfToken, user);
};
