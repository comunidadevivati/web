import type { ProfileGateway } from '@/features/profile/domain/profile';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

export type RequestEmailChangeInput = {
  csrfToken: string;
  currentPassword: string;
  newEmail: string;
};

export const requestEmailChangeUseCase = (
  { csrfToken, currentPassword, newEmail }: RequestEmailChangeInput,
  gateway: ProfileGateway = profileHttpGateway,
) => {
  return gateway.requestEmailChange(csrfToken, currentPassword, newEmail);
};
