import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './server-router'

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

const pikachu = await client.pokemonById.query(1)
console.log({ pikachu })

const createdTangela = await client.upsertPokemon.mutate({
  id: 2,
  name: 'Tangela',
})
console.log({ createdTangela })

const retrievedTangela = await client.pokemonById.query(2)
console.log({ retrievedTangela })
