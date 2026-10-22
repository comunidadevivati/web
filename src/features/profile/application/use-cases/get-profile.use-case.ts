import type { ProfileGateway } from '@/features/profile/domain/profile';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

export const getProfileUseCase = (gateway: ProfileGateway = profileHttpGateway) => {
  return gateway.getProfile();
};
