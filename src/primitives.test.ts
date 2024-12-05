import { describe, expect, it } from 'vitest'
import { literal, number, string } from './primitives'
import type { Schema } from './Schema'

describe('fromPredicate', () => {
  describe.each<{
    schema: Schema<unknown>
    invalidInput: unknown
    validInput: unknown
  }>([
    { schema: string, validInput: 'hello world', invalidInput: 4 },
    { schema: number, validInput: 42, invalidInput: 'hello world' },
    { schema: literal(42), validInput: 42, invalidInput: 43 },
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
        error: {
          input: invalidInput,
          schemaName: schema.name,
          issues: [{ input: invalidInput, schemaName: schema.name, path: [] }],
        },
      })
    })
  })
})
