import { integer, number } from './number'
import { unknown } from './SchemaFactory'

/**
 * @category Reference
 * @see {@link coercedInteger}
 * @see {@link number}
 * @see {@link integer}
 * @example
 * ```ts
 * assert(x.coercedNumber.parse('42').value === 42)
 * assert(x.coercedNumber.parse('42.2').value === 42.2)
 * assert(x.coercedNumber.parse(true).value === 1)
 * assert(x.coercedNumber.parse(false).value === 0)
 *
 * assert(x.coercedNumber.parse('abc').success === false)
 * assert(x.coercedNumber.parse({}).success === false)
 * ```
 */
export const coercedNumber = unknown.convertTo(number.name, number, Number)
/**
 * @category Reference
 * @see {@link coercedNumber}
 * @see {@link number}
 * @see {@link integer}
 * @example
 * ```ts
 * assert(x.coercedInteger.parse('42').value === 42)
 * assert(x.coercedInteger.parse(true).value === 1)
 * assert(x.coercedInteger.parse(false).value === 0)
 *
 * assert(x.coercedInteger.parse('42.2').success === false)
 * assert(x.coercedInteger.parse('abc').success === false)
 * assert(x.coercedInteger.parse({}).success === false)
 * ```
 */
export const coercedInteger = unknown.convertTo(integer.name, integer, Number)
