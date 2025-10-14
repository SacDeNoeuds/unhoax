// will be executed in a service worker.
import { tsr } from '@ts-rest/serverless/fetch'
import {
  Pokemon,
  PokemonAttack,
  pokemonContract,
  PokemonType,
} from './contract'

const pikachu: Pokemon = {
  id: 1,
  name: 'Pikachu',
  health: 100,
  experiencePoints: 12324n,
  caughtAt: new Date('2000-04-02T09:23:24.164Z'),
  types: new Set([PokemonType.Electric]),
  pokeballLocation: 'inventory',
  battleHistory: new Map([[3, 1]]),
  friendIds: [14, 54, 23],
  attacks: [
    PokemonAttack.Earthquake,
    PokemonAttack.Flamethrower,
    PokemonAttack.Thunderbolt,
    PokemonAttack.Surf,
  ],
}

const pokemons = new Map([[pikachu.id, pikachu]])

export const pokemonRouter = tsr.platformContext().router(pokemonContract, {
  getPokemon: async ({ params: { id } }) => {
    if (typeof id === 'string') throw new Error('invalid id', { cause: { id } })
    const pokemon = pokemons.get(id)
    return pokemon
      ? {
          status: 200,
          body: pokemon,
        }
      : {
          status: 404,
          body: {
            message: `Pokemon with id ${id} not found`,
          },
        }
  },
  upsertPokemon: async ({ body }) => {
    pokemons.set(body.id, body)
    return {
      status: 200,
      body,
    }
  },
})
