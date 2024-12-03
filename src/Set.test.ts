import { describe, expect, it } from 'vitest'
import * as S from './Set'
import { string } from './primitives'

describe('Set schema', () => {
  it('parses a valid input', () => {
    const schema = S.Set(string)
    const input = new Set(['a', 'b'])
    const result = schema.parse(input)
    expect(result).toEqual({ success: true, value: input })
  })

  it('fails parsing an invalid item', () => {
    const schema = S.Set(string)
    const input = new Set([1, 2])
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "Set<string>",
        issues: [
          { schemaName: "string", input: 1, path: [0] },
          { schemaName: "string", input: 2, path: [1] },
        ],
      },
    })
  })

  it('fails parsing an non-set', () => {
    const schema = S.Set(string)
    const input = 42
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "Set<string>",
        issues: [
          { schemaName: "Set<string>", input, path: [] },
        ],
      },
    })
  })
})