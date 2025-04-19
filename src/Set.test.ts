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

  it('parses an iterable input', () => {
    const schema = S.Set(string)
    const input = ['a', 'b']
    const result = schema.parse(input)
    expect(result).toEqual({ success: true, value: new Set(input) })
  })

  it('fails parsing an invalid item', () => {
    const schema = S.Set(string)
    const input = new Set([1, 2])
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'Set<string>',
      issues: [
        {
          schemaName: 'string',
          input: 1,
          path: [0],
          message: expect.any(String),
        },
        {
          schemaName: 'string',
          input: 2,
          path: [1],
          message: expect.any(String),
        },
      ],
    })
  })

  it('fails parsing an non-iterable', () => {
    const schema = S.Set(string)
    const input = 42
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'Set<string>',
      issues: [
        {
          schemaName: 'Set<string>',
          input,
          path: [],
          message: expect.any(String),
        },
      ],
    })
  })
})
