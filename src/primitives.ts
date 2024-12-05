import { fromPredicate } from './fromPredicate'
import { map, type Schema } from './Schema'

/**
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.boolean.parse(true) // { success: true, value: true }
 * ```
 */
export const boolean = fromPredicate(
  'boolean',
  (input) => typeof input === 'boolean',
)

/**
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.symbol.parse(Symbol.iterator)
 * // { success: true, value: Symbol.iterator }
 * ```
 */
export const symbol = fromPredicate(
  'symbol',
  (input) => typeof input === 'symbol',
)

/**
 * @category Unsafe Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.untrimmedString.parse('  hello  ') // '  hello  '
 * ```
 */
export const untrimmedString = fromPredicate(
  'string',
  (input) => typeof input === 'string',
)

const trim = map((str: string) => str.trim())
/**
 * This also trims the string. If you do not want this behavior,
 * explicitly use {@link untrimmedString}
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.untrimmedString.parse('  hello  ') // '  hello  '
 * ```
 */
export const string = trim(untrimmedString)

/**
 * This schema only accepts **finite** numbers for safety.<br>
 * If you need full control over your number, use `unsafeNumber` instead.
 *
 * Basically, it accepts anything passing the check `Number.isFinite`.
 *
 * @category 2. Schema
 * @see {@link unsafeNumber}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.number.parse(1) // { success: true, value: 1 }
 * ```
 */
export const number = fromPredicate<number>(
  'number',
  Number.isFinite as (input: unknown) => input is number,
)

/**
 * ⚠️ valid inputs are `Infinity`, `NaN` and unsafe integers.<br>
 * Basically, anything which passes the check `typeof x = 'number'`.
 *
 * @category Unsafe Schema
 * @see {@link number}
 */
export const unsafeNumber = fromPredicate<number>(
  'number',
  (input) => typeof input === 'number',
)

/**
 * it accepts anything passing the check `Number.isSafeInteger`.
 *
 * @category 2. Schema
 * @see {@link number}
 * @see {@link unsafeInteger}
 * @see {@link unsafeNumber}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.integer.parse(1) // { success: true, value: 1 }
 * ```
 */
export const integer = fromPredicate<number>(
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
 */
export const unsafeInteger = fromPredicate<number>(
  'unsafeInteger',
  Number.isInteger as (input: unknown) => input is number,
)

/**
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.bigint.parse(BigInt(12)) // { success: true, value: 12n }
 * x.bigint.parse(BigInt('12')) // { success: true, value: 12n }
 * ```
 */
export const bigint = fromPredicate(
  'bigint',
  (input) => typeof input === 'bigint',
)

/** @ignore */
export type Literal = string | number | boolean | null | undefined
const isLiteral =
  <L extends [Literal, ...Literal[]]>(...literals: L) =>
  (value: unknown): value is L[number] =>
    literals.some((literal) => value === literal)

/**
 * @category Schema Definition
 */
export interface LiteralSchema<L, Input = unknown> extends Schema<L, Input> {
  literals: L[]
}

/**
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.literal('a') // Schema<'a'>
 *
 * const schema = x.literal('a', 42, true, null, undefined)
 * // Schema<'a' | 42 | true | null | undefined>
 * ```
 */
export function literal<L extends [Literal, ...Literal[]], Input = unknown>(
  ...literals: L
): LiteralSchema<L[number], Input> {
  return {
    ...fromPredicate('literal', isLiteral(...literals)),
    literals,
  }
}
