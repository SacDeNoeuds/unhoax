import { describe, expect, it } from 'vitest'
import { boolean, number, string } from './primitives'
import { tuple } from './tuple'

describe('tuple', () => {
  const schema = tuple(string, number, boolean)
  it('parses a valid input', () => {
    const input = ['hello', 42, true]
    const result = schema.parse(input)
    expect(result).toEqual({ success: true, value: input })
  })

  it('fails parsing invalid values', () => {
    const input = ['hello', true, 42]
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "[string, number, boolean]",
        issues: [
          { schemaName: "number", input: true, path: [1] },
          { schemaName: "boolean", input: 42, path: [2] },
        ],
      },
    })
  })

  it('fails parsing an non-array', () => {
    const input = 42
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "[string, number, boolean]",
        issues: [
          { schemaName: "[string, number, boolean]", input, path: [] },
        ],
      },
    })
  })
})