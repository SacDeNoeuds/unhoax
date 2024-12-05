import { fromPredicate } from './fromPredicate'
import type { Schema } from './Schema'

function isInstanceOf<T>(constructor: new (...args: any[]) => T) {
  return (value: unknown): value is T => value instanceof constructor
}

/**
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.instanceOf(Date)
 *
 * class User { … }
 *
 * x.instanceOf(User).parse(new User()) // succeeds
 * ```
 */
export function instanceOf<T, Input = unknown>(
  constructor: new (...args: any[]) => T,
): Schema<T, Input> {
  return fromPredicate(constructor.name, isInstanceOf(constructor))
}
