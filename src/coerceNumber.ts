import { coerce } from './coerce'
import { number, unknown } from './primitives'

/**
 * @category Schema
 * @see {@link number}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * x.coerceNumber.parse('42') // { success: true, value: 42 }
 * x.coerceNumber.parse(42)   // { success: true, value: 42 }
 * ```
 */
export const coerceNumber = coerce(number, Number)(unknown)
