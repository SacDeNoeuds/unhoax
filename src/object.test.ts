import { describe, expect, it } from 'vitest'
import { object, partial } from './object'
import { number, string } from './primitives'

describe('object', () => {
  type Person = { name: string; age: number }
  const person = object<Person>({
    name: string,
    age: number,
  })

  it('parses a valid input', () => {
    expect(person.parse({ name: 'hello', age: 42 })).toEqual({
      success: true,
      value: { name: 'hello', age: 42 },
    })
  })

  it('fails parsing a number', () => {
    expect(person.parse(42)).toEqual({
      success: false,
      error: {
        input: 42,
        schemaName: 'object',
        issues: [{ input: 42, schemaName: 'object', path: [] }],
      },
    })
  })

  it('collects issues when name is number and age is string', () => {
    const result = person.parse({ name: 42, age: 'hello' })
    console.dir(result, { depth: null })
    expect(result).toEqual({
      success: false,
      error: {
        input: { name: 42, age: 'hello' },
        schemaName: 'object',
        issues: [
          { path: ['name'], input: 42, schemaName: 'string' },
          { path: ['age'], input: 'hello', schemaName: 'number' },
        ],
      },
    })
  })

  it('parses only known properties', () => {
    const input = { name: 'hello', age: 42, foo: 'bar' }
    expect(person.parse(input)).toEqual({
      success: true,
      value: { name: input.name, age: input.age },
    })
  })
})

describe('partial', () => {
  type Person = { name: string; age: number }
  const person = object<Person>({
    name: string,
    age: number,
  })

  it('parses a person without age', () => {
    const partialPerson = partial(person, ['age'])
    const result = partialPerson.parse({ name: 'hello' })
    expect(result).toEqual({
      success: true,
      value: { name: 'hello' },
    })
  })

  it('parses an empty object', () => {
    const partialPerson = partial(person)
    const result = partialPerson.parse({})
    expect(result).toEqual({
      success: true,
      value: {},
    })
  })
})
