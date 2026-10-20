import type { MemberStatusAction, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

export const changeMemberStatusUseCase = (
  csrfToken: string,
  id: string,
  action: MemberStatusAction,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.changeMemberStatus(csrfToken, id, action);
};
