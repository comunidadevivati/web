import type { MembershipStatusAction, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

export const changeMembershipStatusUseCase = (
  csrfToken: string,
  id: string,
  action: MembershipStatusAction,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.changeMembershipStatus(csrfToken, id, action);
};
