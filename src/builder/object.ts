import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { BaseSchema, Schema } from './Schema'
import { Factory } from './SchemaFactory'

export type PropsOf<T extends Record<string, any>> = {
  readonly [Key in keyof T]: Schema<T[Key]>
}

export function isObject(input: unknown): input is Record<string, unknown> {
  // input.constructor is `undefined` for null-proto objects.
  return !!input && (input.constructor === Object || !input.constructor)
}

type ObjectShape = Record<PropertyKey, any>

export interface ObjectBuilder<T extends ObjectShape> {
  /**
   * @category Reference
   * @see {@link object}
   * @example
   * ```ts
   * const a = x.object({ name: x.string })
   * const b = x.object({ name: x.number, age: x.number })
   * const c = a.intersect(b)
   *
   * assert(c.parse({ name: 12, age: 18 }).success === true)
   * ```
   */
  intersect<U extends ObjectShape>(
    otherSchema: ObjectSchema<U>,
  ): ObjectSchema<Omit<T, keyof U> & U>
  /**
   * @category Reference
   * @see {@link object}
   * @example
   * ```ts
   * const schema = x.object({ name: x.string, age: x.number }).pick('name')
   *
   * assert.deepEqual(
   *   schema.parse({ name: 'Jack', age: 18 }),
   *   { success: true, value: { name: 'Jack' } },
   * )
   * ```
   */
  pick<Prop extends keyof T>(...props: Prop[]): ObjectSchema<Pick<T, Prop>>
  /**
   * @category Reference
   * @see {@link object}
   * @example
   * ```ts
   * const schema = x.object({ name: x.string, age: x.number }).omit('age')
   *
   * assert.deepEqual(
   *   schema.parse({ name: 'Jack', age: 18 }),
   *   { success: true, value: { name: 'Jack' } },
   * )
   * ```
   */
  omit<Prop extends keyof T>(...props: Prop[]): ObjectSchema<Omit<T, Prop>>
}
/**
 * @category Reference
 * @see {@link object}
 */
export interface ObjectSchema<T extends ObjectShape>
  extends BaseSchema<T>,
    ObjectBuilder<T> {
  readonly props: PropsOf<T>
}

/**
 * @category Reference
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
 * @category Reference
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
  const schema = new Factory({
    name,
    parser: (input, context, self: any) => {
      if (!isObject(input)) return failure(context, name, input)

      const parsed = {} as T
      for (const key in self.props) {
        const schema = self.props[key]
        const nestedContext = withPathSegment(context, key)
        // schema.parse pushes an issue if it fails
        const result = schema.parse(input[key], nestedContext)
        // @ts-ignore
        if (result.success) parsed[key] = result.value
      }
      return success(context, parsed)
    },
  })
  return Object.assign(schema, { props }) as unknown as ObjectSchema<T>
}
