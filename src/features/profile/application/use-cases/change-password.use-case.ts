import type { ProfileGateway } from '@/features/profile/domain/profile';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

export type ChangePasswordInput = {
  csrfToken: string;
  currentPassword: string;
  newPassword: string;
};

export const changePasswordUseCase = (
  { csrfToken, currentPassword, newPassword }: ChangePasswordInput,
  gateway: ProfileGateway = profileHttpGateway,
) => {
  return gateway.changePassword(csrfToken, currentPassword, newPassword);
};
