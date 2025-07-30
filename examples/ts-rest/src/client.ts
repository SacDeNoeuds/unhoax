import { initClient, tsRestFetchApi } from '@ts-rest/core'
import { pokemonContract } from './contract'

const client = initClient(pokemonContract, {
  baseUrl: 'http://localhost:3000',
  baseHeaders: {},
  api: (args) => {
    // TODO: call the service worker instead
    return tsRestFetchApi(args)
  },
})

const res = await client.getPokemon({
  params: { id: '1' },
})

if (res.status === 200) {
  res.body.name
} else {
  res
}
