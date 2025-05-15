import { literal } from './literal'
import { map } from './map'
import { unknown, type Schema } from './Schema'
import { union } from './union'

const undefinedSchema = literal(undefined)
const nullSchema = literal(null)

/**
 * @example
 * ```ts
 * const schema = pipe(
 *   x.string,
 *   x.recover(() => 42),
 * )
 * assert(schema.parse('hey').value === 'hey')
 * assert(schema.parse(true).value === 42)
 * ```
 */
export function recover<U>(
  getFallback: () => U,
): <T>(schema: Schema<T>) => Schema<T | U> {
  return (schema) => union(schema, map(getFallback)(unknown))
}
/**
 * @example
 * ```ts
 * const schema = pipe(
 *   x.string,
 *   x.optional(),
 * )
 * assert(schema.parse(undefined).success === true)
 * assert(schema.parse(undefined).value === undefined)
 * assert(schema.parse('abc').value === 'abc')
 * ```
 * @example with default value
 * ```ts
 * const schema = pipe(x.string, x.optional(42))
 * assert(schema.parse(undefined).success === true)
 * assert(schema.parse(undefined).value === 42)
 * ```
 */
export function optional<U = undefined>(
  defaultValue?: U,
): <T>(schema: Schema<T>) => Schema<T | U> {
  return (schema) =>
    union(map<undefined, U>(() => defaultValue as U)(undefinedSchema), schema)
}

/**
 * @example
 * ```ts
 * const schema = pipe(x.string, x.nullable())
 * assert(schema.parse(null).success === true)
 * assert(schema.parse(null).value === null)
 * assert(schema.parse(null).value === null)
 * assert(schema.parse('abc').value === 'abc')
 * ```
 * @example with default value
 * ```ts
 * const schema = pipe(x.string, x.nullable(42))
 * assert.deepEqual(schema.parse(null), { success: true, value: 42 })
 * ```
 */
export function nullable<U = null>(
  // @ts-ignore TS is terrible with generic and type parameters
  defaultValue: U = null,
): <T>(schema: Schema<T>) => Schema<T | U> {
  return (schema) =>
    union(map<null, U>(() => defaultValue as U)(nullSchema), schema)
}
