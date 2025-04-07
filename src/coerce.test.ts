import { describe, expect, it } from 'vitest'
import { coerce } from './coerce'
import { number, string } from './primitives'
import { date } from './date'

describe('coerce', () => {
  describe('coercing a number', () => {
    const coerceNumber = coerce(number, Number)
    const numberFromString = coerceNumber(string)
    it('coerces a number from a string', () => {
      expect(numberFromString.parse('42')).toEqual({
        success: true,
        value: 42,
      })
    })
  })

  describe('coercing a Date', () => {
    const coerceDate = coerce(date, (value: any) => new Date(value))
    const dateFromString = coerceDate(string)
    it('coerces a Date from a string', () => {
      expect(dateFromString.parse('2020-01-01')).toEqual({
        success: true,
        value: new Date('2020-01-01'),
      })
    })
  })
})
