import { describe, expect, it } from 'vitest'
import {
  intersect,
  object,
  omit,
  partial,
  pick,
  type ObjectSchema,
} from './object'
import { boolean, literal, number, string } from './primitives'

type Person = {
  name: string
  age: number
}
describe.each<{ case: string; schema: ObjectSchema<Person>; name: string }>([
  {
    case: 'unnamed',
    schema: object<Person>({ name: string, age: number }),
    name: 'object',
  },
  {
    case: 'named',
    schema: object<Person>('Person', { name: string, age: number }),
    name: 'Person',
  },
])('$case person schema', ({ schema: person, name: schemaName }) => {
  it('has proper name', () => {
    expect(person.name).toBe(schemaName)
  })

  it('parses a plain object', () => {
    expect(person.parse({ name: 'hello', age: 42 })).toEqual({
      success: true,
      value: { name: 'hello', age: 42 },
    })
  })

  it('parses a null-proto object', () => {
    const input = { name: 'hello', age: 42 }
    Object.setPrototypeOf(input, null)
    expect(person.parse(input)).toEqual({
      success: true,
      value: { name: 'hello', age: 42 },
    })
  })

  it('fails parsing a number', () => {
    expect(person.parse(42)).toEqual({
      success: false,
      input: 42,
      schemaName,
      issues: [
        { input: 42, schemaName, path: [], message: expect.any(String) },
      ],
    })
  })

  it('collects issues when name is number and age is string', () => {
    const result = person.parse({ name: 42, age: 'hello' })
    expect(result).toEqual({
      success: false,
      input: { name: 42, age: 'hello' },
      schemaName,
      issues: [
        {
          path: ['name'],
          input: 42,
          schemaName: 'string',
          message: expect.any(String),
        },
        {
          path: ['age'],
          input: 'hello',
          schemaName: 'number',
          message: expect.any(String),
        },
      ],
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

describe('omit', () => {
  type Person = { name: string; age: number }
  const person = object<Person>({
    name: string,
    age: number,
  })
  const schema = omit<Person, 'age'>('age')(person)

  it('parses a person without age', () => {
    const result = schema.parse({ name: 'hello' })
    expect(result).toEqual({
      success: true,
      value: { name: 'hello' },
    })
  })
})

describe('pick', () => {
  type Person = { name: string; age: number }
  const person = object<Person>({
    name: string,
    age: number,
  })
  const schema = pick<Person, 'age'>('age')(person)

  it('parses a person without age', () => {
    const result = schema.parse({ age: 42 })
    expect(result).toEqual({
      success: true,
      value: { age: 42 },
    })
  })
})

describe('intersect', () => {
  type Person = { name: string; kind: 'adult' | 'child' }
  const person = object<Person>({
    name: string,
    kind: literal('adult', 'child'),
  })
  type Dev = { name: string; kind: boolean }
  const dev = object<Dev>({ name: string, kind: boolean })
  const andDev = intersect(dev)
  const personAndDev = andDev(person)

  it('parses "kind" as a boolean', () => {
    const result = personAndDev.parse({ name: 'hello', kind: true })
    expect(result).toEqual({
      success: true,
      value: { name: 'hello', kind: true },
    })
  })

  it('fails parsing "kind" as "adult"', () => {
    const result = personAndDev.parse({ name: 'hello', kind: 'adult' })
    expect(result).toEqual({
      success: false,
      input: { name: 'hello', kind: 'adult' },
      schemaName: 'object',
      issues: [
        {
          schemaName: 'boolean',
          input: 'adult',
          path: ['kind'],
          message: expect.any(String),
        },
      ],
    })
  })
})
