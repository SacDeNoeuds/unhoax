import { initContract } from '@ts-rest/core'
import { x } from 'unhoax'

const c = initContract()
export interface Pokemon {
  id: number // integer
  name: string
  health: number // float for the example
  experiencePoints: bigint
  caughtAt: Date
  types: Set<PokemonType>
  pokeballLocation: 'inventory' | 'computer'
  battleHistory: Map<Pokemon['id'], number> // BattleId
  friendIds: Pokemon['id'][]
  attacks: [PokemonAttack, PokemonAttack, PokemonAttack, PokemonAttack]
}

export enum PokemonType {
  Water = 'Water',
  Fire = 'Fire',
  Electric = 'Electric',
  Plant = 'Plant',
}
export enum PokemonAttack {
  Earthquake,
  Thunderbolt,
  Flamethrower,
  Surf,
  IceBeam,
  HyperBeam,
}

const PokemonId = x.integer
const pokemonAttackSchema = x.Enum(PokemonAttack)

const Pokemon = x.typed<Pokemon>().object({
  id: PokemonId,
  name: x.string.size({ min: 3 }),
  health: x.number.min(0, 'Health cannot be negative'),
  experiencePoints: x.bigint,
  caughtAt: x.date.refine('must be in past', (date) => date <= new Date()),
  types: x.setOf(x.Enum(PokemonType)),
  pokeballLocation: x.literal('inventory', 'computer'),
  battleHistory: x.mapOf(PokemonId, x.number),
  friendIds: x.array(PokemonId),
  attacks: x.tuple(
    pokemonAttackSchema,
    pokemonAttackSchema,
    pokemonAttackSchema,
    pokemonAttackSchema,
  ),
})

export const pokemonContract = c.router({
  getPokemon: {
    method: 'GET',
    path: '/pokemon/:id',
    pathParams: x.object({
      // id: x.coercedInteger,
      // if you want to give more precision about the fact the input is a string:
      id: x.string.convertTo(x.integer, Number),
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
