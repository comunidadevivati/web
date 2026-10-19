import type {
  CongregationDetails,
  OrganizationGateway,
} from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

export type UpdateCongregationInput = {
  csrfToken: string;
  id: string;
  version: number;
  details: CongregationDetails;
};

export const updateCongregationUseCase = (
  { csrfToken, details, id, version }: UpdateCongregationInput,
  gateway: OrganizationGateway = organizationHttpGateway,
) => {
  return gateway.updateCongregation(csrfToken, id, version, details);
};
