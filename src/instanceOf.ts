import { fromGuard } from './fromGuard'
import type { Schema } from './Schema'

function isInstanceOf<T>(constructor: new (...args: any[]) => T) {
  return (value: unknown): value is T => value instanceof constructor
}

/**
 * @category Schema
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * x.instanceOf(Date).parse(new Date()) // { success: true, value: Date }
 *
 * class User { … }
 *
 * x.instanceOf(User).parse(new User()) // { success: true, value: User }
 * ```
 */
export function instanceOf<T extends Input, Input = unknown>(
  constructor: new (...args: any[]) => T,
): Schema<T, Input> {
  return fromGuard<T, Input>(constructor.name, isInstanceOf(constructor))
}
