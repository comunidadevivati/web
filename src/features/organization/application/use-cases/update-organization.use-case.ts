import type {
  OrganizationDetails,
  OrganizationGateway,
} from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

export type UpdateOrganizationInput = {
  csrfToken: string;
  version: number;
  details: OrganizationDetails;
};

export const updateOrganizationUseCase = (
  { csrfToken, details, version }: UpdateOrganizationInput,
  gateway: OrganizationGateway = organizationHttpGateway,
) => {
  return gateway.updateOrganization(csrfToken, version, details);
};
