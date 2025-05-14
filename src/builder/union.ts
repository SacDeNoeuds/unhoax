import { failure } from '../ParseResult'
import type { ObjectSchema } from './object'
import type { BaseSchema, Schema, TypeOfSchema } from './Schema'
import { Factory } from './SchemaFactory'

function namedUnion<T extends [BaseSchema<any>, ...BaseSchema<any>[]]>(
  name: string,
  schemas: T,
): Schema<TypeOfSchema<T[number]>> {
  return new Factory({
    name,
    meta: { union: { schemas } },
    parser: (input, context) => {
      for (const schema of schemas) {
        const result = schema.parse(input)
        if (result.success) return result
      }
      return failure(context, name, input)
    },
  }) as unknown as Schema<TypeOfSchema<T[number]>>
}

/**
 * If you want to use a discriminated union, checkout {@link variant}
 *
 * @category Schema
 * @example
 * ```ts
 * const schema = x.union(x.string, x.number)
 *
 * assert(schema.parse('a').value === 'a')
 * assert(schema.parse(42).value === 42)
 * assert(schema.parse({}).success === false)
 * ```
 */
export function union<T extends [BaseSchema<any>, ...BaseSchema<any>[]]>(
  ...schemas: T
): BaseSchema<TypeOfSchema<T[number]>> {
  const name = schemas.map((schema) => schema.name).join(' | ')
  return namedUnion(name, schemas as any) as unknown as BaseSchema<
    TypeOfSchema<T[number]>
  >
}

/**
 * If you need to use a simple union, checkout {@link union}
 *
 * @category Schema
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
export function variant<T extends [ObjectSchema<any>, ...ObjectSchema<any>[]]>(
  discriminant: keyof T[number]['props'],
  schemas: T,
): BaseSchema<TypeOfSchema<T[number]>> {
  const name = schemas
    .map(
      (schema) => (schema.props[discriminant] as any).meta.literal.literals[0],
    )
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(' | ')
  return namedUnion(name, schemas as any) as BaseSchema<TypeOfSchema<T[number]>>
}
