import { getMemberUseCase } from '@/features/members/application/use-cases/get-member.use-case';
import { listMembersUseCase } from '@/features/members/application/use-cases/list-members.use-case';
import { listMembershipsUseCase } from '@/features/members/application/use-cases/list-memberships.use-case';
import type { MemberFilters } from '@/features/members/domain/member';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

// Raiz das chaves do contexto Members: invalidada após qualquer alteração.
export const MEMBERS_QUERY_KEY = ['members'] as const;

// Lista paginada por cursor com filtros de situação, congregação e nome.
export const membersQueryOptions = (filters: Omit<MemberFilters, 'cursor'>) => {
  return infiniteQueryOptions({
    queryKey: [...MEMBERS_QUERY_KEY, 'list', filters],
    queryFn: ({ pageParam }) => listMembersUseCase({ ...filters, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
};

export const memberQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [...MEMBERS_QUERY_KEY, 'detail', id],
    queryFn: () => getMemberUseCase(id),
  });
};

export const membershipsQueryOptions = (memberId: string) => {
  return queryOptions({
    queryKey: [...MEMBERS_QUERY_KEY, 'detail', memberId, 'memberships'],
    queryFn: () => listMembershipsUseCase(memberId),
  });
};
