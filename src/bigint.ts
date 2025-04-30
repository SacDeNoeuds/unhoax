import { fromGuard } from './fromGuard'
import { failure, success } from './ParseResult'
import { boolean, number, string } from './primitives'
import { flatMap, type Schema } from './Schema'
import { union } from './union'

const bigIntSchema = fromGuard('bigint', (input) => typeof input === 'bigint')

type BigIntInput = Parameters<typeof BigInt>[0]
const inputSchema: Schema<BigIntInput> = union(
  bigIntSchema,
  number,
  string,
  boolean,
)
const mapBigInt = flatMap((input: BigIntInput, context) => {
  try {
    return success(context, BigInt(input))
  } catch (err) {
    return failure(context, 'bigint', input)
  }
}, 'bigint')

/**
 * @category Schema
 *
 * Accepts any input that can construct a BigInt.
 *
 * @example const schema = x.bigint
 * @example Apply constraints using `x.min`, `x.max` and `x.between`
 * ```ts
 * const schema = pipe(x.bigint, x.min(1n))
 * const schema = pipe(x.bigint, x.min(1n, 'Non-Zero'))
 *
 * const schema = pipe(x.bigint, x.max(10n))
 * const schema = pipe(x.bigint, x.max(10n, 'small'))
 *
 * const schema = pipe(x.bigint, x.between(1n, 10n))
 * const schema = pipe(x.bigint, x.between(1n, 10n, 'small but non-zero'))
 * ```
 */
export const bigint = mapBigInt(inputSchema)
