import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './server-router'

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})
