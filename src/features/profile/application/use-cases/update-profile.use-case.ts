import type { ProfileDetails, ProfileGateway } from '@/features/profile/domain/profile';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

export type UpdateProfileInput = {
  csrfToken: string;
  version: number;
  details: ProfileDetails;
};

export const updateProfileUseCase = (
  { csrfToken, details, version }: UpdateProfileInput,
  gateway: ProfileGateway = profileHttpGateway,
) => {
  return gateway.updateProfile(csrfToken, version, details);
};
