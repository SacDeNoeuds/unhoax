import { failure, ok } from '../ParseResult'
import type { NumericBuilder } from './NumericSchema'
import type { Schema } from './Schema'
import { Factory } from './SchemaFactory'

export interface BigIntSchema extends NumericBuilder<bigint> {}

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
export const bigint = new Factory({
  name,
  parser: (input, context) => {
    try {
      return ok(BigInt(input as any))
    } catch (err) {
      return failure(context!, 'bigint', input)
    }
  },
}) as unknown as Schema<bigint>
