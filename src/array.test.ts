import { describe, expect, it } from 'vitest'
import { array } from './array'
import { object } from './object'
import { number, string } from './primitives'

describe('array', () => {
  type Person = { name: string; age: number }
  const person = array<Person>(
    object({
      name: string,
      age: number,
    }),
  )

  it('parses an array input', () => {
    const input = [{ name: 'hello', age: 42 }]
    expect(person.parse(input)).toEqual({
      success: true,
      value: input,
    })
  })

  it('fails parsing a number (non-array)', () => {
    expect(person.parse(42)).toEqual({
      success: false,
      input: 42,
      schemaName: 'Array<object>',
      issues: [
        {
          input: 42,
          schemaName: 'Array<object>',
          path: [],
          message: expect.any(String),
        },
      ],
    })
  })

  it('collects issues when name is number and age is string', () => {
    const input = [42, { name: 42, age: 'hello' }]
    const result = person.parse(input)
    expect(result).toEqual({
      success: false,
      input,
      schemaName: 'Array<object>',
      issues: [
        {
          path: [0],
          input: 42,
          schemaName: 'object',
          message: expect.any(String),
        },
        {
          path: [1, 'name'],
          input: 42,
          schemaName: 'string',
          message: expect.any(String),
        },
        {
          path: [1, 'age'],
          input: 'hello',
          schemaName: 'number',
          message: expect.any(String),
        },
      ],
    })
  })

  it('fails parsing a string', () => {
    const input = 'test'
    expect(array(string).parse(input).success).toBe(false)
  })

  it('parses an iterable object', () => {
    function* input() {
      yield 1
      yield 2
      yield 3
    }
    expect(array(number).parse(input())).toEqual({
      success: true,
      value: [1, 2, 3],
    })
  })
})
