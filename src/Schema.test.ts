import { describe, expect, it } from 'vitest'
import { flatMap } from './Schema'
import { number, string } from './primitives'

describe('flatMap', () => {
  describe('numberFromString', () => {
    const stringToNumber = flatMap(
      (input: string, context) => number.parse(Number(input), context),
      'numberFromString',
    )
    const numberFromString = stringToNumber(string)

    it('uses provided name', () => {
      expect(numberFromString.name).toBe('numberFromString')
    })

    it('parses a number from a valid string', () => {
      const result = numberFromString.parse('42')
      expect(result).toEqual({ success: true, value: 42 })
    })

    it('fails parsing a number from an invalid string', () => {
      const result = numberFromString.parse('foo')
      console.dir(result, { depth: null })
      expect(result).toEqual({
        success: false,
        error: {
          input: 'foo',
          schemaName: 'numberFromString',
          issues: [{ schemaName: 'number', input: NaN, path: [] }],
        },
      })
    })

    it('fails parsing a non-string – even a number !', () => {
      const result = numberFromString.parse(42)
      expect(result).toEqual({
        success: false,
        error: {
          input: 42,
          schemaName: 'numberFromString',
          issues: [{ schemaName: 'string', input: 42, path: [] }],
        },
      })
    })
  })

  it('does not overwrite the original schema name', () => {
    const stringToNumber = flatMap((input: string) =>
      number.parse(Number(input)),
    )
    const numberFromString = stringToNumber(string)
    expect(numberFromString.name).toBe('string')
  })
})
