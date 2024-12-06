import { instanceOf } from './instanceOf'
import { number, string } from './primitives'
import { refine } from './refine'
import { map, type Schema } from './Schema'
import { union } from './union'

type DateInput = ConstructorParameters<typeof Date>[0]
const inputSchema: Schema<DateInput> = union(instanceOf(Date), string, number)
const mapDateFromInput = map((input: DateInput) => new Date(input), 'Date')
const refineToValidDate = refine(
  'ValidDate',
  (input: Date) => !Number.isNaN(input.valueOf()),
)
const unsafeDate = mapDateFromInput(inputSchema)

/**
 * It can parse anything the `Date` constructor can take as single parameter.
 *
 * If you need to accept `Date` only, use `x.instanceOf(Date)`
 *
 * @category Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.date
 *
 * // Date
 * x.date.parse(new Date()) // succeeds
 *
 * // string
 * x.date.parse('2021-01-02T03:04:05.123Z') // succeeds
 * x.date.parse('2021-01-02') // succeeds
 *
 * // number
 * x.date.parse(Date.now()) // succeeds
 * ```
 */
export const date = refineToValidDate(unsafeDate)
