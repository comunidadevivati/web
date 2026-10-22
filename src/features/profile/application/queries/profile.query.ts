import { getProfileUseCase } from '@/features/profile/application/use-cases/get-profile.use-case';
import { getSubscriptionsUseCase } from '@/features/profile/application/use-cases/get-subscriptions.use-case';
import { queryOptions } from '@tanstack/react-query';

// Raiz das chaves do Perfil: invalidada após qualquer alteração.
export const PROFILE_QUERY_KEY = ['profile'] as const;

// A URL da foto vale 1 h: o cadastro é relido antes disso.
const AVATAR_URL_REFRESH_MS = 30 * 60 * 1000;

export const profileQueryOptions = queryOptions({
  queryKey: [...PROFILE_QUERY_KEY, 'details'],
  queryFn: () => getProfileUseCase(),
  staleTime: AVATAR_URL_REFRESH_MS,
  refetchInterval: AVATAR_URL_REFRESH_MS,
});

export const subscriptionsQueryOptions = queryOptions({
  queryKey: [...PROFILE_QUERY_KEY, 'subscriptions'],
  queryFn: () => getSubscriptionsUseCase(),
});
