import { coerce } from './coerce'
import { number, string } from './primitives'

/**
 * @category Schema
 * @see {@link number}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * x.numberFromString.parse('42') // { success: true, value: 42 }
 * ```
 */
export const numberFromString = coerce(Number, number)(string)
