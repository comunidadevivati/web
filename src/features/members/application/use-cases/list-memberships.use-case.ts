import type { MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

// Histórico completo de vínculos do membro, inclusive os encerrados.
export const listMembershipsUseCase = (
  memberId: string,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.listMemberships(memberId);
};
