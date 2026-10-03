import { queryClient } from './query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
