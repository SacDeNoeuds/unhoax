import { describe, expect, it } from 'vitest'
import { x } from './main'
import { toJsonSchema } from './to-json-schema'

describe('toJsonSchemaString', () => {
  it('converts a string with max size (default)', () => {
    expect(toJsonSchema(x.string)).toEqual({
      type: 'string',
      maxLength: x.string.defaultMaxSize,
    })
  })

  it('converts a string with min size', () => {
    expect(toJsonSchema(x.string.size({ min: 1 }))).toEqual({
      type: 'string',
      minLength: 1,
      maxLength: x.string.defaultMaxSize,
    })
  })

  it('converts a string with no size indication', () => {
    expect(toJsonSchema(x.string.size({ max: Infinity }))).toEqual({
      type: 'string',
    })
  })

  it('converts nullable string', () => {
    expect(toJsonSchema(x.string.nullable())).toEqual({
      anyOf: [
        { enum: [null] },
        { type: 'string', maxLength: x.string.defaultMaxSize },
      ],
    })
  })
})

describe('toJsonSchemaArray', () => {
  it('converts an array with max (default)', () => {
    const schema = x.array(x.string)
  })
})
