import type {
  OrganizationGateway,
  StatusAction,
} from '@/features/organization/domain/organization';
import { organizationHttpGateway } from '@/features/organization/infrastructure/http/organization-http.gateway';

export const changeOrganizationStatusUseCase = (
  csrfToken: string,
  action: StatusAction,
  gateway: OrganizationGateway = organizationHttpGateway,
) => {
  return gateway.changeOrganizationStatus(csrfToken, action);
};
