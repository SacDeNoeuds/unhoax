import { fromGuard } from './fromGuard'
import { map, standardize, type Schema } from './Schema'

/**
 * Never-failing schema.
 * @category Schema
 * @example const schema = x.unknown
 */
export const unknown = standardize<Schema<unknown>>({
  name: 'unknown',
  parse: (input) => ({ success: true, value: input }),
})

/**
 * @category Schema
 * @example const schema = x.boolean
 */
export const boolean = fromGuard(
  'boolean',
  (input) => typeof input === 'boolean',
)

/**
 * @category Schema
 * @example const schema = x.symbol
 * @example
 * ```ts
 * x.symbol.parse(Symbol.iterator) // { success: true, value: Symbol.iterator }
 * ```
 */
export const symbol = fromGuard('symbol', (input) => typeof input === 'symbol')

/**
 * @category Unsafe Schema
 * @see {@link string} for a trimmed string.
 * @example const schema = x.untrimmedString
 * @example
 * ```ts
 * x.untrimmedString.parse('  hello  ') // '  hello  '
 * ```
 */
export const untrimmedString = fromGuard(
  'string',
  (input) => typeof input === 'string',
)

const trim = map((str: string) => str.trim())

/**
 * This also trims the string. If you do not want this behavior,
 * explicitly use {@link untrimmedString}
 * @category Schema
 * @example const schema = x.string
 * @example
 * ```ts
 * x.string.parse('  hello  ') // { success: true, value: 'hello' }
 * ```
 */
export const string = trim(untrimmedString)

/**
 * This schema only accepts **finite** numbers for safety.<br>
 * If you need full control over your number, use `unsafeNumber` instead.
 *
 * Basically, it accepts anything passing the check `Number.isFinite`.
 *
 * @category Schema
 * @see {@link coerceNumber}
 * @see {@link unsafeNumber}
 * @example const schema = x.number
 * @example
 * ```ts
 * x.number.parse(1) // { success: true, value: 1 }
 * x.number.parse(Infinity) // { success: false, … }
 * x.number.parse(NaN) // { success: false, … }
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
 * @example const schema = x.unsafeNumber
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
 * @example const schema = x.integer
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
 * @example const schema = x.unsafeInteger
 */
export const unsafeInteger = fromGuard<number>(
  'unsafeInteger',
  Number.isInteger as (input: unknown) => input is number,
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
 * @category Schema
 * @see {@link LiteralSchema}
 * @example const schema = x.literal('a', 42, true, null, undefined, …)
 */
export function literal<L extends [Literal, ...Literal[]], Input = unknown>(
  ...literals: L
) {
  return standardize<LiteralSchema<L[number], Input>>({
    ...fromGuard('literal', isLiteral(...literals)),
    literals,
  })
}
