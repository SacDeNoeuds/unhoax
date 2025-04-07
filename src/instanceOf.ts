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
 * const schema = x.instanceOf(Date)
 *
 * class User { … }
 *
 * x.instanceOf(User).parse(new User()) // succeeds
 * ```
 */
export function instanceOf<T extends Input, Input = unknown>(
  constructor: new (...args: any[]) => T,
): Schema<T, Input> {
  return fromGuard<T, Input>(constructor.name, isInstanceOf(constructor))
}
