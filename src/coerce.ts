import { flatMap, map, type Schema } from './Schema'
import { union } from './union'

/**
 * @category Advanced Usage / Core
 * @example Building x.numberFromString
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe' // or from elsewhere
 *
 * const numberFromString = pipe(
 *    x.string,
 *    x.coerce(x.number, Number),
 * )
 * numberFromString.parse('42') // { success: true, value: 42 }
 * numberFromString.parse(42)   // { success: false, … } 42 is not a string
 * ```
 * @example not using pipe
 * ```ts
 * const coerceAsNumber = x.coerce(x.number, Number)
 * const numberFromString = coerceAsNumber(x.string)
 *
 * numberFromString.parse('42') // { success: true, value: 42 }
 * ```
 */
export function coerce<T, Input>(
  schema: Schema<T, Input>,
  coercer: (input: Input) => T,
) {
  const mapped = map<any, any>(coercer)
  const flatMapped = flatMap(schema.parse)
  return <S extends Schema<Input, unknown>>(inputSchema: S) =>
    union(schema, flatMapped(mapped(inputSchema)))
}
