import type { MemberProfile, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

// O membro nasce ativo; os vínculos com congregações são registrados depois.
export const registerMemberUseCase = (
  csrfToken: string,
  profile: MemberProfile,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.registerMember(csrfToken, profile);
};
