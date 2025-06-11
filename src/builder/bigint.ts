import { failure, ok } from '../common/ParseResult'
import type { NumericBuilder } from './NumericSchema'
import type { BaseSchema, Schema } from './Schema'
import { Factory } from './SchemaFactory'

export interface BigIntSchema
  extends BaseSchema<bigint>,
    NumericBuilder<bigint> {}

const name = 'bigint'

//  * @category bigint
/**
 * It accepts any input that can construct a BigInt. You can use it to decode JSON coming from a `JSON.parse`
 *
 * @group Reference
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
      return failure(context, 'bigint', input)
    }
  },
}) as unknown as Schema<bigint>
