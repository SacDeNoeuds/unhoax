import { describe, expect, it } from 'vitest'
import { number, string } from './primitives'
import {
  between,
  greaterThan,
  lowerThan,
  nonEmpty,
  pattern,
  refineAs,
  size,
} from './refine'
import type { Schema } from './Schema'
import { Set as setOf } from './Set'

describe('refineAs', () => {
  type Email = string & { _tag: 'Email' }
  const isEmail = (value: string): value is Email => value.includes('@')

  const refineAsEmail = refineAs('Email', isEmail)
  const emailSchema = refineAsEmail(string)

  it('parses an email', () => {
    const result = emailSchema.parse('a@a.com')
    expect(result).toEqual({ success: true, value: 'a@a.com' })
  })

  it('fails parsing a non-email string', () => {
    const result = emailSchema.parse('a')
    expect(result).toEqual({
      success: false,
      error: {
        input: 'a',
        schemaName: 'string',
        issues: [
          { schemaName: 'string', input: 'a', path: [], refinement: 'Email' },
        ],
      },
    })
  })
})

describe.each<{
  name: string
  schema: Schema<number>
  validInputs: number[]
  invalidInputs: number[]
}>([
  {
    name: 'lowerThan(42)',
    schema: lowerThan(42)(number),
    validInputs: [41.99, 0, -10],
    invalidInputs: [42, 100],
  },
  {
    name: 'greaterThan(42)',
    schema: greaterThan(42)(number),
    validInputs: [42.01, 100],
    invalidInputs: [42, 10, -10],
  },
  {
    name: 'between(-2, 42)',
    schema: between(-2, 42)(number),
    validInputs: [-1.99, 41.99],
    invalidInputs: [-2, 42, -10, 100],
  },
])('$name', ({ schema, validInputs, invalidInputs }) => {
  it.each(validInputs)('succeeds with %s', (input) => {
    expect(schema.parse(input)).toEqual({ success: true, value: input })
  })

  it.each(invalidInputs)('fails parsing %s', (invalidInput) => {
    const result = schema.parse(invalidInput)
    expect(result).toEqual({
      success: false,
      error: {
        input: invalidInput,
        schemaName: 'number',
        issues: [
          {
            schemaName: 'number',
            input: invalidInput,
            path: [],
            refinement: expect.any(String),
          },
        ],
      },
    })
  })
})

describe.each<{
  name: string
  schema: Schema<string | Set<number>>
  validInputs: Array<string | Set<number>>
  invalidInputs: Array<string | Set<number>>
}>([
  {
    name: 'nonEmpty string',
    schema: nonEmpty<string>()(string),
    validInputs: ['Hello'],
    invalidInputs: [''],
  },
  {
    name: 'nonEmpty Set',
    schema: nonEmpty<Set<number>>()(setOf(number)),
    validInputs: [new Set([1, 2])],
    invalidInputs: [new Set()],
  },
  {
    name: 'size of string',
    schema: size<string>({ max: 8 })(string),
    validInputs: ['', 'a', 'abcd', '12345678'],
    invalidInputs: ['123456789'],
  },
  {
    name: 'size of Set',
    schema: size<Set<number>>({ min: 4, max: 8 })(setOf(number)),
    validInputs: [new Set([1, 2, 3, 4]), new Set([1, 2, 3, 4, 5, 6, 7, 8])],
    invalidInputs: [
      new Set(),
      new Set([1, 2, 3]),
      new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    ],
  },
  {
    name: 'pattern',
    schema: pattern(/hello/)(string),
    validInputs: ['hello, world', 'hey, hello!'],
    invalidInputs: ['toto', 'helo', 'yo'],
  },
])('$name', ({ schema, validInputs, invalidInputs }) => {
  it.each(validInputs)('succeeds with %s', (input) => {
    expect(schema.parse(input)).toEqual({ success: true, value: input })
  })

  it.each(invalidInputs)('fails parsing %s', (invalidInput) => {
    const result = schema.parse(invalidInput)
    expect(result).toEqual({
      success: false,
      error: {
        input: invalidInput,
        schemaName: schema.name,
        issues: [
          {
            schemaName: schema.name,
            input: invalidInput,
            path: expect.any(Array),
            refinement: expect.any(String),
          },
        ],
      },
    })
  })
})
