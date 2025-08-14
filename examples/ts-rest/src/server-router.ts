// will be executed in a service worker.
import { tsr } from '@ts-rest/serverless/fetch'
import { Pokemon, pokemonContract } from './contract'

const pikachu: Pokemon = {
  id: 1,
  name: 'Pikachu',
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
