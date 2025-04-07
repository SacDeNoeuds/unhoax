import { describe, expect, it } from 'vitest'
import {
  boolean,
  literal,
  number,
  string,
  symbol,
  unknown,
  unsafeNumber,
} from './primitives'
import type { Schema } from './Schema'

describe('fromPredicate', () => {
  describe.each<{
    schema: Schema<unknown>
    invalidInput: unknown
    validInput: unknown
  }>([
    { schema: boolean, validInput: true, invalidInput: 4 },
    { schema: number, validInput: 42, invalidInput: 'hello world' },
    { schema: string, validInput: 'hello world', invalidInput: 4 },
    { schema: unsafeNumber, validInput: Infinity, invalidInput: 'hello world' },
    { schema: literal(42), validInput: 42, invalidInput: 43 },
    { schema: symbol, validInput: Symbol.iterator, invalidInput: 'h' },
  ])('$schema.name', ({ schema, invalidInput, validInput }) => {
    it('parses a valid input', () => {
      expect(schema.parse(validInput)).toEqual({
        success: true,
        value: validInput,
      })
    })

    it('fails parsing an invalid input', () => {
      expect(schema.parse(invalidInput)).toEqual({
        success: false,
        input: invalidInput,
        schemaName: schema.name,
        issues: [
          {
            input: invalidInput,
            schemaName: schema.name,
            path: [],
            message: expect.any(String),
          },
        ],
      })
    })
  })
})

describe('unknown', () => {
  it('always resolves', () => {
    expect(unknown.parse('toto')).toEqual({ success: true, value: 'toto' })
  })
})
