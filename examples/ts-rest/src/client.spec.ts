import { describe, expect, it } from 'vitest'
import { client } from './client'
import { Pokemon } from './contract'

describe('ts-rest client', () => {
  it('gets already-added Pikachu', async () => {
    const response = await client.getPokemon({ params: { id: 1 } })
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ id: 1, name: 'Pikachu' })
  })

  it('fails getting Ratata because non-existent yet', async () => {
    const response = await client.getPokemon({ params: { id: 12 } })
    expect(response.status).toBe(404)
  })

  it('adds & retrieves Tangela', async () => {
    const tangela: Pokemon = {
      id: 2,
      name: 'Tangela',
    }
    const { body: createdTangela } = await client.upsertPokemon({
      body: tangela,
    })
    expect(createdTangela).toEqual(tangela)

    const { body: retrievedTangela } = await client.getPokemon({
      params: { id: tangela.id },
    })
    expect(retrievedTangela).toEqual(tangela)
  })
})
