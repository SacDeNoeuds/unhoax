import { describe, expect, it } from 'vitest'
import { number, string } from './primitives'
import { record } from './record'

describe('record', () => {
  const schema = record(string, number)
  it('parses a valid input', () => {
    const result = schema.parse({ hello: 42 })
    expect(result).toEqual({ success: true, value: { hello: 42 } })
  })

  it('fails parsing a non-object', () => {
    const result = schema.parse(42)
    expect(result).toEqual({
      success: false,
      input: 42,
      schemaName: 'Record<string, number>',
      issues: [
        {
          input: 42,
          schemaName: 'Record<string, number>',
          path: [],
          message: expect.any(String),
        },
      ],
    })
  })

  it('fails parsing an invalid object', () => {
    const input = { a: 1, b: '2' }
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'Record<string, number>',
      issues: [
        {
          input: '2',
          schemaName: 'number',
          path: ['b'],
          message: expect.any(String),
        },
      ],
    })
  })
})
