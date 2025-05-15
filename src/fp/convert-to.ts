import { defineSchema, type Schema } from './Schema'

/**
 * @example
 * ```ts
 * const numberFromString = pipe(
 *   x.string,
 *   x.convertTo(x.number, Number),
 * )
 * assert(numberFromString.parse('42').value === 42)
 * assert(numberFromString.parse('toto').success === false)
 * assert(numberFromString.parse(42).success === false) // input needs to be a string first, then coerced as a number
 *
 * assert(numberFromString.name === 'number')
 * ```
 */
export function convertTo<T, U>(
  schema: Schema<U>,
  coerce: (input: T) => U,
): (schema: Schema<T>) => Schema<U>
/**
 * @example provide a name to the generated schema:
 * ```ts
 * const numberFromString = pipe(
 *   x.string,
 *   x.convertTo(
 *     'numberFromString',
 *     x.number,
 *     Number,
 *   ),
 * )
 *
 * assert(numberFromString.parse('42').value === 42)
 * assert(numberFromString.name === 'numberFromString')
 * ```
 */
export function convertTo<T, U>(
  name: string,
  schema: Schema<U>,
  coerce: (input: T) => U,
): (schema: Schema<T>) => Schema<U>
export function convertTo<T, U>(
  ...args:
    | [name: string, schema: Schema<U>, (value: any) => any]
    | [schema: Schema<U>, (value: any) => any]
) {
  return (self: Schema<T>): any => {
    const [name, schema, coerce] =
      args.length === 3 ? args : [args[0].name, args[0], args[1]]
    return defineSchema({
      // flush the refinements because the output has been transformed
      // and refinements no longer apply from this stage.
      refinements: {},
      name,
      parser: (input, context) => {
        const result = self.parse(input, context)
        if (!result.success) return result
        return schema.parse(coerce(result.value), context)
      },
    })
  }
}
