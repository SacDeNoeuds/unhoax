import { failure, ok } from '../common/ParseResult'
import { instanceOf } from './instance-of'
import { defineSchema } from './Schema'

const name = 'date'

/**
 * It can parse anything the `Date` constructor can take as single parameter.
 *
 * If you need to accept `Date` only, use `x.instanceOf(Date)` @see {@link instanceOf}
 *
 * @category Schema
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
export const date = defineSchema<Date>({
  name,
  parser: (input, context) => {
    const value = new Date(input as any)
    return Number.isNaN(value.valueOf())
      ? failure(context, name, input)
      : ok(value)
  },
})
