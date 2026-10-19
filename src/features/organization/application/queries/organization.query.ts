import { getOrganizationUseCase } from '@/features/organization/application/use-cases/get-organization.use-case';
import { listCongregationsUseCase } from '@/features/organization/application/use-cases/list-congregations.use-case';
import type { CongregationStatus } from '@/features/organization/domain/organization';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

// Raiz das chaves do contexto Organization: invalidada após qualquer alteração.
export const ORGANIZATION_QUERY_KEY = ['organization'] as const;

export const organizationQueryOptions = queryOptions({
  queryKey: [...ORGANIZATION_QUERY_KEY, 'details'],
  queryFn: () => getOrganizationUseCase(),
});

// Primeiras 100 congregações (todas, no porte atual), para escolha em formulários e filtros.
export const congregationOptionsQueryOptions = queryOptions({
  queryKey: [...ORGANIZATION_QUERY_KEY, 'congregations', 'options'],
  queryFn: async () => {
    const { items } = await listCongregationsUseCase({ status: null, cursor: null, limit: 100 });

    return items;
  },
});

// Lista paginada por cursor, com filtro opcional de situação.
export const congregationsQueryOptions = (status: CongregationStatus | null) => {
  return infiniteQueryOptions({
    queryKey: [...ORGANIZATION_QUERY_KEY, 'congregations', status ?? 'ALL'],
    queryFn: ({ pageParam }) => listCongregationsUseCase({ status, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
};
