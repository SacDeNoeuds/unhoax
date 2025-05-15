import { failure, ok } from '../common/ParseResult'
import { defineSchema } from './Schema'

const name = 'bigint'

/**
 * Accepts any input that can construct a BigInt.
 *
 * @category Schema
 * @example
 * ```ts
 * assert.deepEqual(x.bigint.parse(1), { success: true, value: 1n })
 * assert.deepEqual(x.bigint.parse('1'), { success: true, value: 1n })
 * assert.deepEqual(x.bigint.parse(1n), { success: true, value: 1n })
 * assert.deepEqual(x.bigint.parse(true), { success: true, value: 1n })
 *
 * assert(x.bigint.parse(1.54).success === false)
 * assert(x.bigint.parse(1.23).success === false)
 * assert(x.bigint.parse({}).success === false)
 * ```
 */
export const bigint = defineSchema<bigint>({
  name,
  parser: (input, context) => {
    try {
      return ok(BigInt(input as any))
    } catch (err) {
      return failure(context, 'bigint', input)
    }
  },
})
