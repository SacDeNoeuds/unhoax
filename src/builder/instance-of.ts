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
 * ```
 */
export function instanceOf<T extends new (...args: any[]) => any>(
  constructor: T,
): Schema<T> {
  return fromGuard<T>(constructor.name, isInstanceOf(constructor))
}
