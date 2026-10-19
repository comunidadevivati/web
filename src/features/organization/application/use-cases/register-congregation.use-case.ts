import type {
  CongregationRegistration,
  OrganizationGateway,
} from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

// A congregação nasce em rascunho (DRAFT) e precisa ser ativada depois.
export const registerCongregationUseCase = (
  csrfToken: string,
  registration: CongregationRegistration,
  gateway: OrganizationGateway = organizationHttpGateway,
) => {
  return gateway.registerCongregation(csrfToken, registration);
};
