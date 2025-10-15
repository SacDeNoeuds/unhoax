import {
  object,
  type ObjectSchema,
  type ObjectSchemasShape,
  type OutputObjectFromSchemasShape,
} from './object'

/**
 * Unless you absolutely want to use some library function, just use spreading. Cf the example without unhoax.
 *
 * @category Reference
 * @see {@link object}
 * @example Without unhoax
 * ```ts
 * const a = x.object({ name: x.string })
 * const b = x.object({ name: x.number, age: x.number })
 * const c = x.object({ ...a.props, ...b.props })
 *
 * assert(c.parse({ name: 12, age: 18 }).success === true)
 * ```
 * @example With unhoax (prefer without)
 * ```ts
 * import { intersect } from './object.helpers'
 *
 * const a = x.object({ name: x.string })
 * const b = x.object({ name: x.number, age: x.number })
 * const c = intersect(a, b)
 *
 * assert(c.parse({ name: 12, age: 18 }).success === true)
 * ```
 */
export function intersect<
  A extends ObjectSchemasShape,
  B extends ObjectSchemasShape,
>(
  a: ObjectSchema<OutputObjectFromSchemasShape<A>, A>,
  b: ObjectSchema<OutputObjectFromSchemasShape<B>, B>,
): ObjectSchema<
  OutputObjectFromSchemasShape<A> & OutputObjectFromSchemasShape<B>,
  A & B
> {
  return object({
    ...a.props,
    ...b.props,
  }) as any
}

/**
 * I recommend using your own implementation of `omit` considering you usually have one in your project
 *
 * @category Reference
 * @see {@link object}
 * @example Without unhoax utility
 * ```ts
 * import justOmit from 'just-omit'
 *
 * const schema = x.object({ name: x.string, age: x.number })
 * const nextSchema = x.object(justOmit(schema.props, 'age'))
 *
 * assert.deepEqual(
 *   nextSchema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
 * )
 * ```
 * @example With unhoax utility
 * ```ts
 * import { omit } from './object.helpers'
 *
 * const schema = x.object({ name: x.string, age: x.number })
 * const nextSchema = omit(schema, 'age')
 *
 * assert.deepEqual(
 *   nextSchema.parse({ name: 'Jack' }),
 *   { success: true, value: { name: 'Jack' } }, // ✅
 * )
 *
 * assert.deepEqual(
 *   nextSchema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
 * )
 * ```
 */
export function omit<S extends ObjectSchemasShape, K extends keyof S>(
  schema: ObjectSchema<OutputObjectFromSchemasShape<S>, S>,
  ...keys: K[]
): ObjectSchema<Omit<OutputObjectFromSchemasShape<S>, K>, Omit<S, K>> {
  const props = Object.fromEntries(
    Object.entries(schema.props!).filter(([key]) => !keys.includes(key as any)),
  )
  return object(props) as any
}

/**
 * I recommend using your own implementation of `pick` considering you usually have one in your project
 *
 * @category Reference
 * @see {@link object}
 * @example Without unhoax utility
 * ```ts
 * import justPick from 'just-pick'
 *
 * const schema = x.object({ name: x.string, age: x.number })
 * const nextSchema = x.object(justPick(schema.props, 'name'))
 *
 * assert.deepEqual(
 *   nextSchema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
 * )
 * ```
 * @example With unhoax utility
 * ```ts
 * import { pick } from './object.helpers'
 *
 * const schema = x.object({ name: x.string, age: x.number })
 * const nextSchema = pick(schema, 'name')
 *
 * assert.deepEqual(
 *   nextSchema.parse({ name: 'Jack' }),
 *   { success: true, value: { name: 'Jack' } }, // ✅
 * )
 *
 * assert.deepEqual(
 *   nextSchema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
 * )
 * ```
 */
export function pick<S extends ObjectSchemasShape, K extends keyof S>(
  schema: ObjectSchema<OutputObjectFromSchemasShape<S>, S>,
  ...keys: K[]
): ObjectSchema<
  Pick<
    OutputObjectFromSchemasShape<S>,
    Extract<K, keyof OutputObjectFromSchemasShape<S>>
  >,
  Pick<S, K>
> {
  const props = Object.fromEntries(
    Object.entries(schema.props!).filter(([key]) => keys.includes(key as any)),
  )
  return object(props) as any
}
