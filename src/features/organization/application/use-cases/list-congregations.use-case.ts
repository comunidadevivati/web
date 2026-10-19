import type {
  CongregationFilters,
  OrganizationGateway,
} from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

export const listCongregationsUseCase = (
  filters: CongregationFilters,
  gateway: OrganizationGateway = organizationHttpGateway,
) => {
  return gateway.listCongregations(filters);
};
