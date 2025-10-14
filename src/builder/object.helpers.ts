import {
  object,
  type ObjectSchema,
  type ObjectSchemasShape,
  type OutputObjectFromSchemasShape,
} from './object'

/**
 * @category Reference
 * @see {@link object}
 * @example
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
 * @category Reference
 * @see {@link object}
 * @example
 * ```ts
 * import { omit } from './object.helpers'
 *
 * const schema = omit(x.object({ name: x.string, age: x.number }), 'age')
 *
 * assert.deepEqual(
 *   schema.parse({ name: 'Jack' }),
 *   { success: true, value: { name: 'Jack' } },
 * )
 *
 * assert.deepEqual(
 *   schema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } },
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
 * @category Reference
 * @see {@link object}
 * @example
 * ```ts
 * import { pick } from './object.helpers'
 *
 * const schema = pick(x.object({ name: x.string, age: x.number }), 'name')
 *
 * assert.deepEqual(
 *   schema.parse({ name: 'Jack' }),
 *   { success: true, value: { name: 'Jack' } },
 * )
 *
 * assert.deepEqual(
 *   schema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } },
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
