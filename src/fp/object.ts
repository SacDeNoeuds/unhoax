import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import { defineSchema, type Schema } from './Schema'

export type PropsOf<T extends Record<string, any>> = {
  readonly [Key in keyof T]: Schema<T[Key]>
}

export function isObject(input: unknown): input is Record<string, unknown> {
  // input.constructor is `undefined` for null-proto objects.
  return !!input && (input.constructor === Object || !input.constructor)
}

type ObjectShape = Record<PropertyKey, any>

/**
 * @category Schema
 * @see {@link object}
 */
export interface ObjectSchema<T extends ObjectShape> extends Schema<T> {
  readonly props: PropsOf<T>
}

/**
 * @category Schema
 * @example
 * ```ts
 * const person = x.object({ name: x.string })
 * assert(person.parse({ name: 'Jack' }).success === true)
 * assert(person.parse({ name: 42 }).success === false)
 * ```
 * @example it parses null prototype objects
 * ```ts
 * const schema = x.object({ n: x.number })
 * const a = Object.create(null)
 * a.n = 1
 * assert(schema.parse(a).success === true)
 *
 * assert(schema.parse({ __proto__: null, n: 1 }).success === true)
 *
 * assert(schema.parse([]).success === false)
 * assert(schema.parse('abc').success === false)
 * assert(schema.parse(42).success === false)
 * assert(schema.parse(new Set()).success === false)
 * assert(schema.parse(new Map()).success === false)
 * ```
 */
export function object<T extends ObjectShape>(
  props: PropsOf<T>,
): ObjectSchema<T>
/**
 * @category Schema
 * @example
 * ```ts
 * const person = x.object('Person', { name: x.string })
 * assert(person.parse({ name: 'Jack' }).success === true)
 * assert(person.parse({ name: 42 }).success === false)
 * assert(person.name === 'Person')
 * ```
 */
export function object<T extends ObjectShape>(
  name: string,
  props: PropsOf<T>,
): ObjectSchema<T>
export function object<T extends ObjectShape>(
  ...args: [name: string, props: T] | [props: T]
) {
  const [name, props] = args.length === 1 ? ['object', args[0]] : args
  const schema = defineSchema<T>({
    name,
    parser: (input, context) => {
      if (!isObject(input)) return failure(context, name, input)

      const parsed = {} as T
      for (const key in props) {
        const schema = props[key]
        const result = withPathSegment(context, key, (nestedContext) => {
          // schema.parse pushes an issue if it fails
          return schema.parse(input[key], nestedContext)
        })
        // @ts-ignore
        if (result.success) parsed[key] = result.value
      }
      return success(context, parsed)
    },
  })
  return Object.assign(schema, { props }) as unknown as ObjectSchema<T>
}

/**
 * @example
 * ```ts
 * const a = x.object({ name: x.string })
 * const b = x.object({ name: x.number, age: x.number })
 * const c = pipe(a, x.intersect(b))
 *
 * assert(c.parse({ name: 12, age: 18 }).success === true)
 * ```
 */
export function intersect<U extends ObjectShape>(otherSchema: ObjectSchema<U>) {
  return <T extends ObjectShape>(schema: ObjectSchema<T>) =>
    object({
      ...schema.props,
      ...otherSchema.props,
    })
}
/**
 * @example
 * ```ts
 * const schema = pipe(
 *   x.object({ name: x.string, age: x.number }),
 *   x.pick('name'),
 * )
 *
 * assert.deepEqual(
 *   schema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } },
 * )
 * ```
 */
export function pick<T extends ObjectShape, Prop extends keyof T>(
  ...props: Prop[]
) {
  return (schema: ObjectSchema<T>): ObjectSchema<Pick<T, Prop>> => {
    const entries = Object.entries(schema.props).filter(([key]) =>
      props.includes(key as any),
    )
    return object(Object.fromEntries(entries) as Pick<T, Prop>)
  }
}
/**
 * @example
 * ```ts
 * const schema = pipe(
 *   x.object({ name: x.string, age: x.number }),
 *   x.omit('age'),
 * )
 *
 * assert.deepEqual(
 *   schema.parse({ name: 'Jack', age: 18 }),
 *   { success: true, value: { name: 'Jack' } },
 * )
 * ```
 */
export function omit<T extends ObjectShape, Prop extends keyof T>(
  ...props: Prop[]
) {
  return (schema: ObjectSchema<T>): ObjectSchema<Omit<T, Prop>> => {
    const entries = Object.entries(schema.props).filter(
      ([key]) => !props.includes(key as any),
    )
    return object(Object.fromEntries(entries) as Omit<T, Prop>)
  }
}
