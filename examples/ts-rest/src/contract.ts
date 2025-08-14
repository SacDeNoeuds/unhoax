import { initContract } from '@ts-rest/core'
import { x } from 'unhoax'

const c = initContract()
export interface Pokemon {
  id: number
  name: string
}

const Pokemon = x.object<Pokemon>({
  id: x.number,
  name: x.string,
})

const integerFromString = x.string.convertTo(x.integer, Number)

export const pokemonContract = c.router({
  getPokemon: {
    method: 'GET',
    path: '/pokemon/:id',
    pathParams: x.object({
      id: x.union(integerFromString, x.string),
    }),
    responses: {
      200: Pokemon,
      404: x.object({ message: x.string }),
    },
    summary: 'Get a pokemon by id',
  },
  upsertPokemon: {
    method: 'POST',
    path: '/upsert-pokemon',
    summary: 'Upsert a pokemon',
    body: Pokemon,
    responses: {
      200: Pokemon,
    },
  },
})
