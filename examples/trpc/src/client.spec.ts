import { createTRPCClient, unstable_localLink } from '@trpc/client'
import { describe, expect, it } from 'vitest'
import { appRouter, Pokemon } from './server-router'

describe('tRPC client', () => {
  const client = createTRPCClient({
    links: [
      unstable_localLink({
        createContext: async () => ({}),
        router: appRouter,
      }),
    ],
  })

  it('gets already-added pikachu', async () => {
    const pikachu = await client.pokemonById.query(1)
    expect(pikachu).toEqual({ id: 1, name: 'Pikachu' })
  })

  it('adds & retrieves new tangela', async () => {
    const tangela: Pokemon = {
      id: 2,
      name: 'Tangela',
    }
    const createdTangela = await client.upsertPokemon.mutate(tangela)
    expect(createdTangela).toEqual(tangela)

    const retrievedTangela = await client.pokemonById.query(2)
    expect(retrievedTangela).toEqual(tangela)
  })
})
