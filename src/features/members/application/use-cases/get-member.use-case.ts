import type { MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

export const getMemberUseCase = (id: string, gateway: MembersGateway = membersHttpGateway) => {
  return gateway.getMember(id);
};
