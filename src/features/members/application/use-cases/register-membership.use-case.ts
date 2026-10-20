import type { MembershipRegistration, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

// O vínculo nasce pendente e precisa ser ativado.
export const registerMembershipUseCase = (
  csrfToken: string,
  memberId: string,
  registration: MembershipRegistration,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.registerMembership(csrfToken, memberId, registration);
};
