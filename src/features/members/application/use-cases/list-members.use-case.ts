import type { MemberFilters, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

export const listMembersUseCase = (
  filters: MemberFilters,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.listMembers(filters);
};
