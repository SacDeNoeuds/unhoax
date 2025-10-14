import { object, type ObjectSchema, type ObjectShape } from './object'

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
export function intersect<A extends ObjectShape, B extends ObjectShape>(
  a: ObjectSchema<A>,
  b: ObjectSchema<B>,
): ObjectSchema<A & B> {
  return object({
    ...a.props,
    ...b.props,
  }) as unknown as ObjectSchema<A & B>
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
export function omit<T extends ObjectShape, K extends keyof T>(
  schema: ObjectSchema<T>,
  ...keys: K[]
): ObjectSchema<Omit<T, K>> {
  const props = Object.fromEntries(
    Object.entries(schema.props!).filter(([key]) => !keys.includes(key as any)),
  )
  return object(props) as unknown as ObjectSchema<Omit<T, K>>
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
export function pick<T extends ObjectShape, K extends keyof T>(
  schema: ObjectSchema<T>,
  ...keys: K[]
): ObjectSchema<Pick<T, K>> {
  const props = Object.fromEntries(
    Object.entries(schema.props!).filter(([key]) => keys.includes(key as any)),
  )
  return object(props) as unknown as ObjectSchema<Pick<T, K>>
}
