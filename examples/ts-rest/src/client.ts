import { initClient, tsRestFetchApi } from '@ts-rest/core'
import { PokemonAttack, pokemonContract, PokemonType } from './contract'

export const client = initClient(pokemonContract, {
  baseUrl: 'http://localhost:3000',
  baseHeaders: {},
  api: (args) => {
    // TODO: call the service worker instead
    return tsRestFetchApi(args)
  },
})

const query = await client.getPokemon({
  params: { id: '1' },
})

if (query.status === 200) {
  query.body.name
} else {
  query
}

const mutation = await client.upsertPokemon({
  body: {
    id: 1,
    name: 'Tangela',
    health: 100,
    experiencePoints: 1120390139402n,
    caughtAt: new Date('2001-04-06T12:01:34.031Z'),
    types: [PokemonType.Plant], // will be coerced as Set
    pokeballLocation: 'inventory',
    battleHistory: [[3, 1]], // will be coerced as Map<PokemonId, BattleId>
    friendIds: [43, 55, 11, 30],
    attacks: [
      PokemonAttack.HyperBeam,
      PokemonAttack.Earthquake,
      PokemonAttack.Flamethrower,
      PokemonAttack.Surf,
    ],
  },
})

if (mutation.status !== 200) {
  throw mutation
} else {
  mutation.body.attacks
}
