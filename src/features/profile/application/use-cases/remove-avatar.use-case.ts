import type { ProfileGateway } from '@/features/profile/domain/profile';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

export const removeAvatarUseCase = (
  csrfToken: string,
  gateway: ProfileGateway = profileHttpGateway,
) => {
  return gateway.removeAvatar(csrfToken);
};
