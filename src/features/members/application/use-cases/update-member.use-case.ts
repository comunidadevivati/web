import type { MemberProfile, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

export type UpdateMemberInput = {
  csrfToken: string;
  id: string;
  version: number;
  profile: MemberProfile;
};

export const updateMemberUseCase = (
  { csrfToken, id, profile, version }: UpdateMemberInput,
  gateway: MembersGateway = membersHttpGateway,
) => {
  return gateway.updateMember(csrfToken, id, version, profile);
};
