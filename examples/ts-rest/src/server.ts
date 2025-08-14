import { fetchRequestHandler } from '@ts-rest/serverless/fetch'
import { pokemonContract } from './contract'
import { pokemonRouter } from './server-router'

// @ts-expect-error this is typed poorly at the moment.
self.addEventListener('fetch', async (event: FetchEvent) => {
  const response = await fetchRequestHandler({
    contract: pokemonContract,
    options: {},
    request: event.request,
    router: pokemonRouter,
  })
  event.respondWith(response)
})
