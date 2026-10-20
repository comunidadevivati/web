import type { MemberFromUserOutcome, MembersGateway } from '@/features/members/domain/member';
import { membersHttpGateway } from '@/features/members/infrastructure/http/members-http.gateway';

// Limite de contas por pedido no BFF.
export const MAX_MEMBERS_PER_REQUEST = 50;

// Um membro nunca é cadastrado do zero: ele é gerado a partir de contas com e-mail verificado.
// Seleções maiores que o limite vão em pedidos sucessivos.
export const createMembersFromUsersUseCase = async (
  csrfToken: string,
  userIds: readonly string[],
  gateway: MembersGateway = membersHttpGateway,
) => {
  const outcomes: MemberFromUserOutcome[] = [];

  for (let start = 0; start < userIds.length; start += MAX_MEMBERS_PER_REQUEST) {
    const chunk = userIds.slice(start, start + MAX_MEMBERS_PER_REQUEST);

    // oxlint-disable-next-line no-await-in-loop -- pedidos sucessivos intencionais
    outcomes.push(...(await gateway.createMembersFromUsers(csrfToken, chunk)));
  }

  return outcomes;
};
