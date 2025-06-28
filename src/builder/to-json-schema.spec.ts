import { Ajv } from 'ajv'
import { describe, expect, it } from 'vitest'
import { x } from './main'
import { toJsonSchema } from './to-json-schema'

x.string.defaultMaxSize = 10
x.array.defaultMaxSize = 3

const ajv = new Ajv()

describe('toJsonSchemaString', () => {
  it('converts a string with max size (default)', () => {
    const schema = toJsonSchema(x.string)
    expect(schema).toEqual({
      type: 'string',
      maxLength: x.string.defaultMaxSize,
    })
    expect(ajv.validate(schema, 'toto')).toBe(true)
    expect(ajv.validate(schema, '12345678910')).toBe(false)
    expect(ajv.validate(schema, 42)).toBe(false)
  })

  it('converts a string with min size', () => {
    const schema = toJsonSchema(x.string.size({ min: 1 }))
    expect(schema).toEqual({
      type: 'string',
      minLength: 1,
      maxLength: x.string.defaultMaxSize,
    })
    expect(ajv.validate(schema, 'toto')).toBe(true)
    expect(ajv.validate(schema, '')).toBe(false)
  })

  it('converts a string with no size indication', () => {
    const schema = toJsonSchema(x.string.size({ max: Infinity }))
    expect(schema).toEqual({ type: 'string' })
    expect(ajv.validate(schema, '12345678910')).toBe(true)
  })

  it('converts nullable string', () => {
    const schema = toJsonSchema(x.string.nullable())
    expect(schema).toEqual({
      anyOf: [
        { enum: [null] },
        { type: 'string', maxLength: x.string.defaultMaxSize },
      ],
    })
    expect(ajv.validate(schema, 'toto')).toBe(true)
    expect(ajv.validate(schema, null)).toBe(true)
  })
})

describe('toJsonSchemaArray', () => {
  it('converts an array with max (default)', () => {
    const schema = toJsonSchema(x.array(x.string))
    expect(schema).toEqual({
      type: 'array',
      items: toJsonSchema(x.string),
      maxItems: x.array.defaultMaxSize,
    })
    expect(ajv.validate(schema, [])).toBe(true)
    expect(ajv.validate(schema, ['a'])).toBe(true)
    expect(ajv.validate(schema, ['', '', '', ''])).toBe(false)
    expect(ajv.validate(schema, [1])).toBe(false)
    expect(ajv.validate(schema, [{}])).toBe(false)
  })

  it('converts an array with min length', () => {
    const schema = toJsonSchema(x.array(x.string).size({ min: 1 }))
    expect(schema).toEqual({
      type: 'array',
      items: toJsonSchema(x.string),
      minItems: 1,
      maxItems: x.array.defaultMaxSize,
    })
    expect(ajv.validate(schema, [''])).toBe(true)
    expect(ajv.validate(schema, [])).toBe(false)
    expect(ajv.validate(schema, ['', '', '', ''])).toBe(false)
  })

  it('converts an array with no length constraints', () => {
    const schema = toJsonSchema(x.array(x.string).size({ max: Infinity }))
    expect(schema).toEqual({
      type: 'array',
      items: toJsonSchema(x.string),
    })
    expect(ajv.validate(schema, [])).toBe(true)
    expect(ajv.validate(schema, ['', '', '', ''])).toBe(true)
  })
})

describe('toJsonSchemaBoolean', () => {
  it('converts a boolean', () => {
    const schema = toJsonSchema(x.boolean)
    expect(schema).toEqual({ type: 'boolean' })
    expect(ajv.validate(schema, true)).toBe(true)
    expect(ajv.validate(schema, false)).toBe(true)
  })
})
