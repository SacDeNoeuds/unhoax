import { describe, expect, it } from 'vitest'
import { numberFromString } from './numberFromString'

describe('coerce', () => {
  describe('coercing a number', () => {
    it('coerces a number from a string', () => {
      expect(numberFromString.parse('42')).toEqual({
        success: true,
        value: 42,
      })
    })
  })
})
