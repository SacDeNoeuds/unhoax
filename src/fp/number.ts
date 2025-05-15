import { fromGuard } from './from-guard'

/**
 * This schema only accepts **finite** numbers for safety.<br>
 * If you need full control over your number, use `unsafeNumber` instead.
 *
 * Basically, it accepts anything passing the check `Number.isFinite`.
 *
 * @category Schema
 * @see {@link coerceNumber}
 * @see {@link unsafeNumber}
 * @example
 * ```ts
 * assert(x.number.parse(1).success === true)
 * assert(x.number.parse(-1.12).success === true)
 *
 * assert(x.number.parse(Infinity).success === false)
 * assert(x.number.parse(NaN).success === false)
 *
 * assert(x.number.parse(true).success === false)
 * assert(x.number.parse('abc').success === false)
 * ```
 */
export const number = fromGuard<number>(
  'number',
  Number.isFinite as (input: unknown) => input is number,
)

/**
 * ⚠️ valid inputs are `Infinity`, `NaN` and unsafe integers.<br>
 * Basically, anything which passes the check `typeof x = 'number'`.
 *
 * @category Unsafe Schema
 * @see {@link number}
 * @example
 * ```ts
 * assert(x.unsafeNumber.parse(1).success === true)
 * assert(x.unsafeNumber.parse(-1.12).success === true)
 *
 * assert(x.unsafeNumber.parse(Infinity).success === true)
 * assert(x.unsafeNumber.parse(NaN).success === true)
 *
 * assert(x.unsafeNumber.parse(true).success === false)
 * assert(x.unsafeNumber.parse('abc').success === false)
 * ```
 */
export const unsafeNumber = fromGuard<number>(
  'number',
  (input) => typeof input === 'number',
)

/**
 * it accepts anything passing the check `Number.isSafeInteger`.
 *
 * @category Schema
 * @see {@link number}
 * @see {@link unsafeInteger}
 * @see {@link unsafeNumber}
 * @example
 * ```ts
 * assert(x.integer.parse(42).success === true)
 * assert(x.integer.parse(-42).success === true)
 *
 * assert(x.integer.parse(31.2).success === false)
 * assert(x.integer.parse(Infinity).success === false)
 * assert(x.integer.parse(NaN).success === false)
 * assert(x.integer.parse(1e100).success === false)
 *
 * assert(x.integer.parse(true).success === false)
 * assert(x.integer.parse('abc').success === false)
 * ```
 */
export const integer = fromGuard<number>(
  'integer',
  Number.isSafeInteger as (input: unknown) => input is number,
)
/**
 * it accepts anything passing the check `Number.isInteger`.
 *
 * @category Unsafe Schema
 * @see {@link integer}
 * @see {@link number}
 * @see {@link unsafeNumber}
 * @example
 * ```ts
 * assert(x.unsafeInteger.parse(42).success === true)
 * assert(x.unsafeInteger.parse(-42).success === true)
 * assert(x.unsafeInteger.parse(1e100).success === true)
 *
 * assert(x.unsafeInteger.parse(31.2).success === false)
 * assert(x.unsafeInteger.parse(Infinity).success === false)
 * assert(x.unsafeInteger.parse(NaN).success === false)
 *
 * assert(x.unsafeInteger.parse(true).success === false)
 * assert(x.unsafeInteger.parse('abc').success === false)
 * ```
 */
export const unsafeInteger = fromGuard<number>(
  'unsafeInteger',
  Number.isInteger as (input: unknown) => input is number,
)
