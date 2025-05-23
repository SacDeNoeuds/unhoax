import { describe, expect, it } from 'vitest'
import { bigint } from './bigint'
import { number, string } from './primitives'
import { between, guardAs, max, min, nonEmpty, pattern, size } from './refine'
import type { Schema } from './Schema'
import { Set as setOf } from './Set'

describe('refineAs', () => {
  type Email = string & { _tag: 'Email' }
  const isEmail = (value: string): value is Email => value.includes('@')

  const refineAsEmail = guardAs('Email', isEmail)
  const emailSchema = refineAsEmail(string)

  it('parses an email', () => {
    const result = emailSchema.parse('a@a.com')
    expect(result).toEqual({ success: true, value: 'a@a.com' })
  })

  it('fails parsing a non-email string', () => {
    const result = emailSchema.parse('a')
    expect(result).toEqual({
      success: false,
      input: 'a',
      schemaName: 'string',
      issues: [
        {
          schemaName: 'string',
          input: 'a',
          path: [],
          refinement: 'Email',
          message: expect.any(String),
        },
      ],
    })
  })
})

describe.each<{
  name: string
  schema: Schema<number | bigint>
  validInputs: (number | bigint)[]
  invalidInputs: (number | bigint)[]
}>([
  {
    name: 'max(42)',
    schema: max(42)(number),
    validInputs: [42, 0, -10],
    invalidInputs: [42.01, 100],
  },
  {
    name: 'max(42n)',
    schema: max(42n)(bigint),
    validInputs: [42n, 0n],
    invalidInputs: [43n, 100n],
  },
  {
    name: 'min(42)',
    schema: min(42)(number),
    validInputs: [42, 100],
    invalidInputs: [41.99, 10, -10],
  },
  {
    name: 'min(42n)',
    schema: min(42n)(bigint),
    validInputs: [42n, 100n],
    invalidInputs: [41n, 10n],
  },
  {
    name: 'between(-2, 42)',
    schema: between(-2, 42)(number),
    validInputs: [-2, 42],
    invalidInputs: [-2.01, 42.01, -10, 100],
  },
  {
    name: 'between(2n, 42n)',
    schema: between(2n, 42n)(bigint),
    validInputs: [2n, 42n],
    invalidInputs: [1n, 43n],
  },
])('$name', ({ schema, validInputs, invalidInputs }) => {
  it.each(validInputs)('succeeds with %s', (input) => {
    expect(schema.parse(input)).toEqual({ success: true, value: input })
  })

  it.each(invalidInputs)('fails parsing %s', (invalidInput) => {
    const result = schema.parse(invalidInput)
    expect(result).toEqual({
      success: false,
      input: invalidInput,
      schemaName: schema.name,
      issues: [
        {
          schemaName: schema.name,
          input: invalidInput,
          path: [],
          refinement: expect.any(String),
          message: expect.any(String),
        },
      ],
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
      input: invalidInput,
      schemaName: schema.name,
      issues: [
        {
          schemaName: schema.name,
          input: invalidInput,
          path: expect.any(Array),
          refinement: expect.any(String),
          message: expect.any(String),
        },
      ],
    })
  })
})
