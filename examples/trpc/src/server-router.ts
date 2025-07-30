import { initTRPC } from '@trpc/server'
import { x } from 'unhoax'

const t = initTRPC.create()

const router = t.router
const publicProcedure = t.procedure

export type AppRouter = typeof appRouter

interface Pokemon {
  id: number
  name: string
}
const pokemonSchema = x.object<Pokemon>({
  id: x.number,
  name: x.string,
})
const pikachu: Pokemon = { id: 1, name: 'Pikachu' }
const pokemons = new Map([[pikachu.id, pikachu]])

export const appRouter = router({
  pokemonById: publicProcedure
    .input(x.coercedNumber)
    .query(async ({ input: pokemonId }) => {
      return pokemons.get(pokemonId) ?? null
    }),
  upsertPokemon: publicProcedure
    .input(pokemonSchema)
    .mutation(async ({ input: pokemon }) => {
      pokemons.set(pokemon.id, pokemon)
      return pokemon
    }),
})
