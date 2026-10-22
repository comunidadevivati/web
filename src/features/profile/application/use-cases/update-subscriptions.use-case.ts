import type { ProfileGateway, Subscriptions } from '@/features/profile/domain/profile';
import { profileHttpGateway } from '@/features/profile/infrastructure/http/profile-http.gateway';

export const updateSubscriptionsUseCase = (
  csrfToken: string,
  subscriptions: Subscriptions,
  gateway: ProfileGateway = profileHttpGateway,
) => {
  return gateway.updateSubscriptions(csrfToken, subscriptions);
};
