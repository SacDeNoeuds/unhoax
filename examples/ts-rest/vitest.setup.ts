import { fetchRequestHandler } from '@ts-rest/serverless/fetch'
import { vi } from 'vitest'
import { pokemonContract } from './src/contract'
import { pokemonRouter } from './src/server-router'

globalThis.fetch = vi.fn(async (input, init) => {
  const request = new Request(input, init)
  const response = await fetchRequestHandler({
    contract: pokemonContract,
    options: {},
    request: request,
    router: pokemonRouter,
  })
  return response
})
