import type {
  OrganizationGateway,
  StatusAction,
} from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

export const changeCongregationStatusUseCase = (
  csrfToken: string,
  id: string,
  action: StatusAction,
  gateway: OrganizationGateway = organizationHttpGateway,
) => {
  return gateway.changeCongregationStatus(csrfToken, id, action);
};
