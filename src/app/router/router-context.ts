import type { QueryClient } from '@tanstack/react-query';

// Contexto disponível em todas as rotas (beforeLoad/loader): guards consultam o cache do Query.
export type RouterContext = {
  queryClient: QueryClient;
};
