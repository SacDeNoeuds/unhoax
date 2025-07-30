// will be executed in a service worker.
import { fetchRequestHandler, tsr } from '@ts-rest/serverless/fetch'
import { pokemonContract } from './contract'

const pokemonRouter = tsr.platformContext().router(pokemonContract, {
  getPokemon: async ({ params: { id } }) => {
    return {
      status: 200,
      body: {
        id,
        name: 'Pikachu',
      },
    }
  },
})

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
