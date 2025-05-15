import { ok } from '../common/ParseResult'
import { defineSchema, type Schema } from './Schema'

/**
 * @example
 * ```ts
 * import { capitalize } from './test-utils'
 *
 * const capitalized = pipe(
 *   x.string,
 *   x.map(capitalize),
 * )
 * assert(capitalized.parse('hey').value === 'Hey')
 * ```
 */
export function map<T, U>(
  name: string,
  mapper: (value: T) => U,
): (schema: Schema<T>) => Schema<U>
export function map<T, U>(
  mapper: (value: T) => U,
): (schema: Schema<T>) => Schema<U>
export function map<T, U>(
  ...args: [name: string, mapper: (value: T) => U] | [mapper: (value: T) => U]
) {
  return (schema: Schema<T>): Schema<U> => {
    const [name = schema.name, mapper] =
      args.length === 1 ? [undefined, args[0]] : args
    return defineSchema<U>({
      // flush the refinements because the output has been transformed
      // and refinements no longer apply from this stage.
      refinements: {},
      name,
      parser: (input, context) => {
        const result = schema.parse(input, context)
        if (!result.success) return result
        return ok(mapper(result.value))
      },
    })
  }
}
