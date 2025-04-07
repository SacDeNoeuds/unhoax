import { flatMap, map, type Schema } from './Schema'

/**
 * @category Advanced Usage / Core
 * @example Implementation of x.numberFromString
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe'
 *
 * const coerceNumber = x.coerce(Number, x.number)
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
  coercer: (input: Input) => T,
  schema: Schema<T, Input>,
) {
  const mapped = map<any, any>(coercer)
  const flatMapped = flatMap(schema.parse)
  return <S extends Schema<Input, unknown>>(schema: S) =>
    flatMapped(mapped(schema))
}
