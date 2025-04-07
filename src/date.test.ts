import { describe, expect, it } from 'vitest'
import { date } from './date'

describe('date', () => {
  it.each<[string, string | Date | number]>([
    ['date', new Date()],
    ['number', Date.now()],
    ['partial iso string', '2021-01-02'],
    ['iso string', '2021-01-02T03:04:05.123Z'],
  ])('parses valid %s', (_, input) => {
    const expected = new Date(input)
    const result = date.parse(input)
    expect(result).toEqual({ success: true, value: expected })
  })

  it.each<[string, string | Date | number]>([
    ['date', new Date(NaN)],
    ['string', 'not a date'],
  ])('fails parsing an invalid %s', (_, input) => {
    const result = date.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'Date',
      issues: [
        {
          schemaName: 'Date',
          refinement: 'ValidDate',
          input,
          path: [],
          message: expect.any(String),
        },
      ],
    })
  })

  it.each<[string, unknown]>([
    ['number', NaN],
    ['boolean', true],
    ['object', {}],
    ['symbol', Symbol()],
  ])('fails parsing an invalid date %s input', (_, input) => {
    const result = date.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'Date',
      issues: [
        {
          schemaName: 'Date | string | number',
          input,
          path: [],
          message: expect.any(String),
        },
      ],
    })
  })
})
