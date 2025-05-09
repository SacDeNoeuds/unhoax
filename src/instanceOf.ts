import { fromGuard } from './fromGuard'
import type { Schema } from './Schema'

function isInstanceOf<T>(constructor: new (...args: any[]) => T) {
  return (value: unknown): value is T => value instanceof constructor
}

/**
 * @category Schema
 * @example parsing a Date
 * ```ts
 * x.instanceOf(Date).parse(new Date()) // { success: true, value: Date }
 * ```
 * @example parsing a custom `User` class
 * ```ts
 * class User { … }
 * x.instanceOf(User).parse(new User()) // { success: true, value: User }
 * ```
 */
export function instanceOf<T>(
  constructor: new (...args: any[]) => T,
): Schema<T> {
  return fromGuard<T>(constructor.name, isInstanceOf(constructor))
}
