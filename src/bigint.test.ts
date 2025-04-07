import { describe, expect, it } from 'vitest'
import { bigint } from './bigint'

describe('bigint', () => {
  type BigIntInput = Parameters<typeof BigInt>[0]
  it.each<BigIntInput>([1n, 1, '1', true])('parses %s', (input) => {
    const result = bigint.parse(input)
    expect(result).toEqual({ success: true, value: 1n })
  })

  it('fails parsing a non-bigint-input value', () => {
    const input = new Date()
    const result = bigint.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'bigint',
      issues: [
        {
          schemaName: 'bigint | number | string | boolean',
          message: expect.any(String),
          input,
          path: [],
        },
      ],
    })
  })

  it('fails parsing a bigint non-constructible value', () => {
    const input = 'not a bigint'
    const result = bigint.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'bigint',
      issues: [
        { schemaName: 'bigint', message: expect.any(String), input, path: [] },
      ],
    })
  })
})
