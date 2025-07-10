import { failure, ok } from '../common/ParseResult'
import { instanceOf } from './instance-of'
import type { NumericBuilder } from './NumericSchema'
import type { BaseSchema, Schema } from './Schema'
import { Factory } from './SchemaFactory'

type DateInput = ConstructorParameters<typeof Date>[0]

/**
 * @category Reference
 * @see {@link date}
 */
export interface DateSchema<Input = DateInput>
  extends BaseSchema<Date, Input>,
    NumericBuilder<Date> {}

const name = 'date'

/**
 * It can parse anything the `Date` constructor can take as single parameter.
 *
 * If you need to accept `Date` only, use `x.instanceOf(Date)` @see {@link instanceOf}
 *
 * @category Reference
 * @example const schema = x.date
 * @example parses a Date
 * ```ts
 * const now = new Date()
 * assert.deepEqual(
 *   x.date.parse(now),
 *   { success: true, value: now },
 * )
 * ```
 * @example parses a string
 * ```ts
 * const a = '2021-01-02T03:04:05.123Z'
 * assert.deepEqual(
 *   x.date.parse(a),
 *   { success: true, value: new Date(a) },
 * )
 *
 * const b = '2021-01-02'
 * assert.deepEqual(
 *   x.date.parse(b),
 *   { success: true, value: new Date(b) },
 * )
 * assert(x.date.parse('oopsie').success === false)
 * ```
 * @example parses a number
 * ```ts
 * const timestamp = Date.now()
 * assert.deepEqual(
 *   x.date.parse(timestamp),
 *   { success: true, value: new Date(timestamp) },
 * )
 * assert(x.date.parse(NaN).success === false)
 * assert(x.date.parse(() => {}).success === false)
 * ```
 */
export const date = new Factory({
  name,
  parser: (input, context) => {
    const value = new Date(input as DateInput)
    return Number.isNaN(value.valueOf())
      ? failure(context, name, input)
      : ok(value)
  },
}) as unknown as Schema<Date, DateInput>
