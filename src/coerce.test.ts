import { describe, expect, it } from 'vitest'
import { coerce } from './coerce'
import { date } from './date'
import { string } from './primitives'

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
