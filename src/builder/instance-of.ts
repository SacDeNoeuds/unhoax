import { fromGuard } from './from-guard'
import type { Schema } from './Schema'

const isInstanceOf = <T>(constructor: new (...args: any[]) => T) => {
  return (value: unknown): value is T => value instanceof constructor
}

/**
 * @category Reference
 * @example parsing a Date
 * ```ts
 * const schema = x.instanceOf(Date)
 * assert(schema.parse(new Date()).success === true)
 * ```
 * @example parsing a custom `User` class
 * ```ts
 * class User {}
 * const schema = x.instanceOf(User)
 * assert(schema.parse(new User()).success === true)
 * assert(schema.parse({}).success === false)
 * ```
 * @example usage with `convertTo`
 * ```ts
 * class User {
 *   constructor(public name: string) {}
 * }
 * const schema = x.string.convertTo(x.instanceOf(User), (name) => new User(name))
 * const result = schema.parse('Jack')
 * assert(result.success === true)
 * assert(result.value instanceof User)
 * assert(result.value.name === 'Jack')
 * ```
 */
export function instanceOf<T extends new (...args: any[]) => any>(
  constructor: T,
): Schema<{ input: T; output: T }> {
  return fromGuard<T>(constructor.name, isInstanceOf(constructor))
}
