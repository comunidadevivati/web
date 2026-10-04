import type { AuthUser } from '@/features/auth/domain/auth-user';
import { storeAuthUser } from '@/features/auth/infrastructure/storage/auth-user.storage';

type LoginInput = {
  email: string;
};

export const loginUseCase = ({ email }: LoginInput): AuthUser => {
  const user: AuthUser = {
    email,
  };

  storeAuthUser(user);

  return user;
};
