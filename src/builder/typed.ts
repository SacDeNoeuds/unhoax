import { object, type ObjectSchema, type ObjectShape } from './object'
import type { SchemaLike } from './SchemaFactory'

type PropsOf<T extends Record<string, any>> = {
  readonly [Key in keyof T]: SchemaLike<T[Key], any>
}

export interface Typed<T> {
  /**
   * @category Reference
   * @example
   * ```ts
   * interface Person {
   *   name: string
   * }
   * const person = x.typed<Person>().object({ name: x.string })
   * assert(person.parse({ name: 'Jack' }).success === true)
   * assert(person.parse({ name: 42 }).success === false)
   * assert(person.name === 'object')
   * ```
   */
  object<Schemas extends PropsOf<Extract<T, ObjectShape>>>(
    schemas: Schemas,
  ): ObjectSchema<Extract<T, ObjectShape>, Schemas>
  /**
   * @category Reference
   * @example
   * ```ts
   * interface Person {
   *   name: string
   * }
   * const person = x.typed<Person>().object('Person', { name: x.string })
   * assert(person.parse({ name: 'Jack' }).success === true)
   * assert(person.parse({ name: 42 }).success === false)
   * assert(person.name === 'Person')
   * ```
   */
  object<Schemas extends PropsOf<Extract<T, ObjectShape>>>(
    name: string,
    schemas: Schemas,
  ): ObjectSchema<Extract<T, ObjectShape>, Schemas>
}

export function typed<T>(): Typed<T> {
  return {
    object: object as unknown as Typed<T>['object'],
  }
}
