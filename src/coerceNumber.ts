// import { coerce } from './coerce'
// import { number, unknown } from './primitives'

// /**
//  * @category Schema
//  * @see {@link number}
//  *
//  * Accepts any input that can construct a number. Validates the constructed number is valid (not NaN).
//  * Validates that the number is safe (`Number.isSafeNumber`).
//  *
//  * If you want to accept unsafe numbers, use {@link unsafeNumber}.
//  *
//  * If you need to coerce integer, {@link refine} this schema with `x.refine(Number.isInteger)`
//  * @example
//  * ```ts
//  * import { x } from 'unhoax'
//  *
//  * x.coerceNumber.parse('42') // { success: true, value: 42 }
//  * x.coerceNumber.parse(42)   // { success: true, value: 42 }
//  * ```
//  */
// export const coerceNumber = coerce(number, Number)(unknown)
