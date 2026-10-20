import type { OrganizationGateway } from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

export const getOrganizationUseCase = (gateway: OrganizationGateway = organizationHttpGateway) => {
  return gateway.getOrganization();
};
