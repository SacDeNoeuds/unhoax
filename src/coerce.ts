import { flatMap, map, type Schema } from './Schema'

/**
 * @category Modifier
 * @example Coercing a date from a string
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe'
 *
 * const coerceDate = x.coerce(x.date, (value: any) => new Date(value))
 * const dateFromString = coerceDate(x.string)
 * dateFromString.parse('2020-01-01') // { success: true, value: Date }
 *
 * const dateFromString = pipe(
 *   x.string,
 *   x.coerce(x.date, (value: any) => new Date(value)),
 * )
 * dateFromString.parse('2020-01-01') // { success: true, value: Date }
 * ```
 *
 * @example Coercing a number from a string
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe'
 *
 * const coerceNumber = x.coerce(x.number, Number)
 * const numberFromString = coerceNumber(x.string)
 * numberFromString.parse('42') // { success: true, value: 42 }
 *
 * const numberFromString = pipe(
 *   x.string,
 *   x.coerce(x.number, Number),
 * )
 * numberFromString.parse('42') // { success: true, value: 42 }
 * ```
 */
export function coerce<T, Input>(
  schema: Schema<T, Input>,
  coercer: (input: Input) => T,
) {
  const mapped = map<any, any>(coercer)
  const flatMapped = flatMap(schema.parse)
  return <S extends Schema<Input, unknown>>(schema: S) =>
    flatMapped(mapped(schema))
}
