import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './server-router'

// @ts-expect-error typing is poor.
self.addEventListener('fetch', async (event: FetchEvent) => {
  const response = await fetchRequestHandler({
    endpoint: '/',
    req: event.request,
    router: appRouter,
  })
  event.respondWith(response)
})
