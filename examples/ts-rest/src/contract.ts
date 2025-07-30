import { initContract } from '@ts-rest/core'
import { x } from 'unhoax'

const c = initContract()
const Pokemon = x.object({
  id: x.number,
  name: x.string,
})
export const pokemonContract = c.router({
  getPokemon: {
    method: 'GET',
    path: '/pokemon/:id',
    pathParams: x.object({
      id: x.coercedInteger,
    }),
    responses: {
      200: Pokemon,
    },
    summary: 'Get a pokemon by id',
  },
})
