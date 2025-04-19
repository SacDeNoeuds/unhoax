import { describe, expect, it } from 'vitest'
import { coerceNumber } from './coerceNumber'

describe('coerce', () => {
  describe('coercing a number', () => {
    it('coerces a number from a string', () => {
      expect(coerceNumber.parse('42')).toEqual({
        success: true,
        value: 42,
      })
    })

    it('parses a number as number', () => {
      expect(coerceNumber.parse(42)).toEqual({
        success: true,
        value: 42,
      })
    })
  })
})
