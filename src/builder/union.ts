import { failure } from '../common/ParseResult'
import type { TypeOf } from '../common/Schema'
import type { ObjectSchema } from './object'
import type { InputOf, Schema } from './Schema'
import { Factory, type SchemaLike } from './SchemaFactory'

export interface UnionSchema<
  S extends [SchemaLike<any, any>, ...SchemaLike<any, any>[]],
> extends Schema<{
    input: InputOf<S[number]>
    output: TypeOf<S[number]>
    meta: { schemas: S }
  }> {}

function namedUnion<
  S extends [SchemaLike<any, any>, ...SchemaLike<any, any>[]],
>(name: string, schemas: S): UnionSchema<S> {
  return new Factory({
    name,
    schemas,
    parser: (input, context) => {
      for (const schema of schemas) {
        const result = schema.parse(input)
        if (result.success) return result
      }
      return failure(context, name, input)
    },
  }) as unknown as UnionSchema<S>
}

/**
 * If you want to use a discriminated union, checkout {@link variant}
 *
 * @category Reference
 * @example
 * ```ts
 * const schema = x.union(x.string, x.number)
 *
 * assert(schema.parse('a').value === 'a')
 * assert(schema.parse(42).value === 42)
 * assert(schema.parse({}).success === false)
 * ```
 */
export function union<
  S extends [SchemaLike<any, any>, ...SchemaLike<any, any>[]],
>(...schemas: S): UnionSchema<S> {
  const name = schemas.map((schema) => schema.name).join(' | ')
  return namedUnion(name, schemas) as UnionSchema<S>
}

/**
 * If you need to use a simple union, checkout {@link union}
 *
 * @category Reference
 * @example
 * ```ts
 * const a = x.object({ type: x.literal('a'), a: x.string }),
 * const b = x.object({ type: x.literal('b'), b: x.number }),
 *
 * const schema = x.variant('type', [a, b])
 *
 * assert.deepEqual(
 *   schema.parse({ type: 'a', a: 'Hello' }),
 *   { success: true, value: { type: 'a', a: 'Hello' } }
 * )
 * assert.deepEqual(
 *   schema.parse({ type: 'b', b: 42 }),
 *   { success: true, value: { type: 'b', b: 42 } }
 * )
 *
 * assert(schema.name === 'a | b')
 * ```
 */
export function variant<
  S extends [ObjectSchema<any, any>, ...ObjectSchema<any, any>[]],
>(discriminant: keyof S[number]['props'], schemas: S): UnionSchema<S> {
  const name = schemas
    .map((schema) => (schema.props?.[discriminant] as any).literals[0])
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(' | ')
  return namedUnion(name, schemas) as UnionSchema<S>
}
