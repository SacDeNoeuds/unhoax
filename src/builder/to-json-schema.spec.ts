import { Ajv } from 'ajv'
import addFormats from 'ajv-formats'
import { describe, expect, it } from 'vitest'
import { x } from './main'
import { toJsonSchema } from './to-json-schema'

x.string.defaultMaxSize = 10
x.array.defaultMaxSize = 3

const ajv = new Ajv()
addFormats(ajv)

describe('unsupported schema', () => {
  it('throws upon unsupported schema', () => {
    expect(() => toJsonSchema(x.unknown)).toThrow('unsupported schema')
  })
})

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

  it('converts a string with pattern', () => {
    const schema = toJsonSchema(x.string.pattern(/(abc)/))
    expect(schema).toEqual({
      type: 'string',
      pattern: '(abc)',
      maxLength: x.string.defaultMaxSize,
    })
    expect(ajv.validate(schema, 'abc')).toBe(true)
    expect(ajv.validate(schema, 'def')).toBe(false)
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

describe('toJsonSchemaNumber', () => {
  describe.each([x.number, x.unsafeNumber])('$name', (number) => {
    it('converts a number', () => {
      const schema = toJsonSchema(number)
      expect(schema).toEqual({ type: 'number' })
      expect(ajv.validate(schema, 123.12)).toBe(true)
      expect(ajv.validate(schema, -123)).toBe(true)
      expect(ajv.validate(schema, Infinity)).toBe(false)
      expect(ajv.validate(schema, 'abc')).toBe(false)
    })

    it('converts a min number', () => {
      const schema = toJsonSchema(number.min(10))
      expect(schema).toEqual({ type: 'number', minimum: 10 })
      expect(ajv.validate(schema, 10)).toBe(true)
      expect(ajv.validate(schema, 9.99)).toBe(false)
    })

    it('converts a greater-than number', () => {
      const schema = toJsonSchema(number.gt(10))
      expect(schema).toEqual({ type: 'number', exclusiveMinimum: 10 })
      expect(ajv.validate(schema, 10.1)).toBe(true)
      expect(ajv.validate(schema, 10)).toBe(false)
    })

    it('converts a max number', () => {
      const schema = toJsonSchema(number.max(10))
      expect(schema).toEqual({ type: 'number', maximum: 10 })
      expect(ajv.validate(schema, 10)).toBe(true)
      expect(ajv.validate(schema, 10.1)).toBe(false)
    })

    it('converts a lower-than number', () => {
      const schema = toJsonSchema(number.lt(10))
      expect(schema).toEqual({ type: 'number', exclusiveMaximum: 10 })
      expect(ajv.validate(schema, 9.99)).toBe(true)
      expect(ajv.validate(schema, 10)).toBe(false)
    })
  })
  describe.each([x.integer, x.unsafeInteger])('$name', (integer) => {
    it('converts an integer', () => {
      const schema = toJsonSchema(integer)
      expect(schema).toEqual({ type: 'integer' })
      expect(ajv.validate(schema, 123)).toBe(true)
      expect(ajv.validate(schema, -123)).toBe(true)
      expect(ajv.validate(schema, Infinity)).toBe(false)
      expect(ajv.validate(schema, 123.12)).toBe(false)
      expect(ajv.validate(schema, 'abc')).toBe(false)
    })

    it('converts a min integer', () => {
      const schema = toJsonSchema(integer.min(10))
      expect(schema).toEqual({ type: 'integer', minimum: 10 })
      expect(ajv.validate(schema, 10)).toBe(true)
      expect(ajv.validate(schema, 9)).toBe(false)
    })

    it('converts a greater-than integer', () => {
      const schema = toJsonSchema(integer.gt(10))
      expect(schema).toEqual({ type: 'integer', exclusiveMinimum: 10 })
      expect(ajv.validate(schema, 11)).toBe(true)
      expect(ajv.validate(schema, 10)).toBe(false)
    })

    it('converts a max integer', () => {
      const schema = toJsonSchema(integer.max(10))
      expect(schema).toEqual({ type: 'integer', maximum: 10 })
      expect(ajv.validate(schema, 10)).toBe(true)
      expect(ajv.validate(schema, 11)).toBe(false)
    })

    it('converts a lower-than integer', () => {
      const schema = toJsonSchema(integer.lt(10))
      expect(schema).toEqual({ type: 'integer', exclusiveMaximum: 10 })
      expect(ajv.validate(schema, 9)).toBe(true)
      expect(ajv.validate(schema, 10)).toBe(false)
    })
  })
})

describe('toJsonSchemaDate', () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  it('converts a date', () => {
    const schema = toJsonSchema(x.date)
    expect(schema).toEqual({
      type: 'string',
      format: 'date-time',
    })
    expect(ajv.validate(schema, today.toISOString())).toBe(true)
    expect(ajv.validate(schema, 'def')).toBe(false)
  })

  it('converts a date with min', () => {
    const schema = toJsonSchema(x.date.min(today))
    expect(schema).toEqual({
      type: 'string',
      format: 'date-time',
      formatMinimum: today.toISOString(),
    })
    expect(ajv.validate(schema, today.toISOString())).toBe(true)
    expect(ajv.validate(schema, tomorrow.toISOString())).toBe(true)
    expect(ajv.validate(schema, yesterday.toISOString())).toBe(false)
  })

  it('converts a date with max', () => {
    const schema = toJsonSchema(x.date.max(today))
    expect(schema).toEqual({
      type: 'string',
      format: 'date-time',
      formatMaximum: today.toISOString(),
    })
    expect(ajv.validate(schema, today.toISOString())).toBe(true)
    expect(ajv.validate(schema, yesterday.toISOString())).toBe(true)
    expect(ajv.validate(schema, tomorrow.toISOString())).toBe(false)
  })
})

describe('toJsonSchemaEnum', () => {
  it('converts an enum', () => {
    enum Test {
      A = 'a',
      B = 42,
    }
    const schema = toJsonSchema(x.Enum(Test))
    expect(schema).toEqual({ enum: ['B', 'a', 42] })
    expect(ajv.validate(schema, 'a')).toBe(true)
    expect(ajv.validate(schema, 42)).toBe(true)
    expect(ajv.validate(schema, 'other')).toBe(false)
    expect(ajv.validate(schema, 12)).toBe(false)
    expect(ajv.validate(schema, null)).toBe(false)
  })
})

describe('toJsonSchemaSet', () => {
  it('converts a set', () => {
    const schema = toJsonSchema(x.setOf(x.number))
    expect(schema).toEqual({
      type: 'array',
      items: { type: 'number' },
      maxItems: x.setOf.defaultMaxSize,
      uniqueItems: true,
    })
    expect(ajv.validate(schema, [1, 2])).toBe(true)
    expect(ajv.validate(schema, [1, 1])).toBe(false)
  })
})

describe('toJsonSchemaObject', () => {
  it('converts an object', () => {
    const s = x.object({ name: x.string, age: x.number.optional() })
    const schema = toJsonSchema(s)
    expect(schema).toEqual({
      type: 'object',
      properties: {
        name: toJsonSchema(x.string),
        age: toJsonSchema(x.number.optional()),
      },
      required: ['name'],
      additionalProperties: false,
    })
    expect(ajv.validate(schema, { name: 'John', age: 30 })).toBe(true)
    expect(ajv.validate(schema, { name: 'John' })).toBe(true)
    expect(ajv.validate(schema, { name: 'John', age: '30' })).toBe(false)
    expect(ajv.validate(schema, { name: 'John', extra: 1 })).toBe(false)
  })
})

describe('toJsonSchemaTuple', () => {
  it('converts a tuple', () => {
    const s = x.tuple(x.string, x.number)
    const schema = toJsonSchema(s)
    expect(schema).toEqual({
      type: 'array',
      items: [toJsonSchema(x.string), toJsonSchema(x.number)],
      minItems: 2,
      maxItems: 2,
    })
    expect(ajv.validate(schema, ['John', 30])).toBe(true)
    expect(ajv.validate(schema, ['John'])).toBe(false)
    expect(ajv.validate(schema, ['John', '30'])).toBe(false)
  })
})

describe('toJsonSchemaRecord', () => {
  it.each([x.number, x.string])(
    'converts a record with $name keys',
    (keySchema) => {
      // coercion is lost in JSON Schema
      const schema = toJsonSchema(x.record(keySchema as any, x.number))
      expect(schema).toEqual({
        type: 'object',
        additionalProperties: toJsonSchema(x.number),
      })
      expect(ajv.validate(schema, { one: 1, two: 2 })).toBe(true)
      expect(ajv.validate(schema, { 1: 1, 2: 2 })).toBe(true)
      expect(ajv.validate(schema, { one: '1', two: 2 })).toBe(false)
      expect(ajv.validate(schema, { 1: '1', two: 2 })).toBe(false)
    },
  )
})
