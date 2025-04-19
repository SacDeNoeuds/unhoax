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
      expect(result).toEqual({
        success: false,
        input: 'foo',
        schemaName: 'numberFromString',
        issues: [
          {
            schemaName: 'number',
            input: NaN,
            path: [],
            message: expect.any(String),
          },
        ],
      })
    })

    it('fails parsing a non-string – even a number !', () => {
      const result = numberFromString.parse(42)
      expect(result).toEqual({
        success: false,
        input: 42,
        schemaName: 'numberFromString',
        issues: [
          {
            schemaName: 'string',
            input: 42,
            path: [],
            message: expect.any(String),
          },
        ],
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

  it('maps the failure', () => {
    let callCount = 0
    const stringToNumber = flatMap(
      (input: string) => number.parse(Number(input)),
      'numberFromString',
      (failure) => {
        callCount++
        return failure
      },
    )
    const numberFromString = stringToNumber(string)
    numberFromString.parse(12)
    expect(callCount).toBe(1)
  })
})
