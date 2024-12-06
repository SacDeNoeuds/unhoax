import { fromPredicate } from './fromPredicate'
import { failure, success } from './ParseResult'
import { boolean, number, string } from './primitives'
import { flatMap, type Schema } from './Schema'
import { union } from './union'

const bigIntSchema = fromPredicate(
  'bigint',
  (input) => typeof input === 'bigint',
)

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
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * x.bigint.parse(12n) // { success: true, value: 12n }
 * x.bigint.parse(BigInt(12)) // { success: true, value: 12n }
 * x.bigint.parse(BigInt('12')) // { success: true, value: 12n }
 * ```
 */
export const bigint = mapBigInt(inputSchema)
