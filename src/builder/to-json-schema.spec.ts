import { describe, expect, it } from 'vitest'
import { x } from './main'
import { toJsonSchema } from './to-json-schema'

describe('toJsonSchemaString', () => {
  it.only('converts a string with max size (default)', () => {
    expect(toJsonSchema(x.string)).toEqual({
      type: 'string',
      maxLength: x.string.defaultMaxSize,
    })
  })
})

describe('toJsonSchemaArray', () => {
  it('converts an array with max (default)', () => {
    const schema = x.array(x.string)
  })
})
