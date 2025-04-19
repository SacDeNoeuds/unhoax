import type { ObjectSchema } from './object'
import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import type { LiteralSchema } from './primitives'
import {
  standardize,
  type InputOfSchema,
  type Schema,
  type TypeOfSchema,
} from './Schema'

/**
 * @category Schema Definition
 * @see {@link union}
 * @see {@link variant}
 */
export interface UnionSchema<T, Input = unknown> extends Schema<T, Input> {
  readonly schemas: Schema<unknown>[]
}
function namedUnion<T extends [Schema<any, any>, ...Schema<any, any>[]]>(
  name: string,
  schemas: T,
) {
  return standardize<
    UnionSchema<TypeOfSchema<T[number]>, InputOfSchema<T[number]>>
  >({
    name,
    schemas,
    refinements: [],
    parse: (input, context = createParseContext(name, input)) => {
      for (const schema of schemas) {
        const result = schema.parse(input)
        if (result.success) return success(context, result.value)
      }
      return failure(context, name, input)
    },
  })
}

/**
 * If you want to use a discriminated union, checkout {@link variant}
 *
 * @category Schema
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const schema = x.union(x.string, x.number) // Schema<string | number>
 * schema.parse('a')
 * // { success: true, value: 'a' }
 * ```
 */
export function union<T extends [Schema<any, any>, ...Schema<any, any>[]]>(
  ...schemas: T
): UnionSchema<TypeOfSchema<T[number]>, InputOfSchema<T[number]>> {
  const name = schemas.map((schema) => schema.name).join(' | ')
  return namedUnion(name, schemas)
}

/**
 * If you need to use a simple union, checkout {@link union}
 *
 * @category Schema
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const a = x.object({ type: x.literal('a'), a: x.string }),
 * const b = x.object({ type: x.literal('b'), b: x.number }),
 *
 * const schema = x.variant('type', [a, b])
 * // Schema<{ type: 'a', a: string } | { type: 'b', b: number }>
 *
 * const result = schema.parse({ type: 'a', a: 'Hello' })
 * // { success: true, value: { type: 'a', a: 'Hello' } }
 * ```
 */
export function variant<
  T extends [ObjectSchema<any, any>, ...ObjectSchema<any, any>[]],
>(
  discriminant: keyof T[number]['props'],
  schemas: T,
): UnionSchema<TypeOfSchema<T[number]>, InputOfSchema<T[number]>> {
  const name = schemas
    .map(
      (schema) =>
        (schema.props[discriminant] as LiteralSchema<string>).literals?.[0] ??
        schema.name,
    )
    .join(' | ')
  return namedUnion(name, schemas)
}
