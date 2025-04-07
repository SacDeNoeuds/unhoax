import { describe, expect, it } from 'vitest'
import { instanceOf } from './instanceOf'

describe('instanceOf', () => {
  class User {
    constructor(readonly name: string) {}
  }

  describe.each<{
    Class: new (...args: any[]) => any
    validInput: unknown
    invalidInput: unknown
  }>([
    { Class: Date, validInput: new Date(), invalidInput: new User('Jack') },
    { Class: User, validInput: new User('Jack'), invalidInput: new Date() },
  ])('$Class.name', ({ Class, validInput, invalidInput }) => {
    it('parses a valid input', () => {
      expect(instanceOf(Class).parse(validInput)).toEqual({
        success: true,
        value: validInput,
      })
    })

    it('fails parsing an invalid input', () => {
      expect(instanceOf(Class).parse(invalidInput)).toEqual({
        success: false,
        input: invalidInput,
        schemaName: Class.name,
        issues: [
          {
            schemaName: Class.name,
            message: expect.any(String),
            input: invalidInput,
            path: [],
          },
        ],
      })
    })
  })
})
