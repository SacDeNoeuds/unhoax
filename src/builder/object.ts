import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { Schema, TypeOf } from './Schema'
import { Factory, type SchemaLike } from './SchemaFactory'

export type PropsOf<T extends Record<string, any>> = {
  readonly [Key in keyof T]: SchemaLike<T[Key], any>
}

export function isObject(input: unknown): input is Record<string, unknown> {
  // input.constructor is `undefined` for null-proto objects.
  return !!input && (input.constructor === Object || !input.constructor)
}

export type ObjectShape = Record<PropertyKey, any>

/**
 * @category Reference
 * @see {@link object}
 */
export interface ObjectSchema<T extends ObjectShape, Schemas = PropsOf<T>>
  extends Schema<{ input: T; output: T; meta: { props: Schemas } }> {}

type SchemasShape = Record<PropertyKey, SchemaLike<any, any>>
type ObjectFromSchemas<S extends SchemasShape> = {
  [Key in keyof S as TypeOf<S[Key]> extends undefined ? Key : never]?: TypeOf<
    S[Key]
  >
} & {
  [Key in keyof S as TypeOf<S[Key]> extends undefined ? never : Key]: TypeOf<
    S[Key]
  >
}
/**
 * @category Reference
 *
 * To use a Type-Driven approach, see {@link typed}
 *
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
export function object<Schemas extends SchemasShape>(
  props: Schemas,
): ObjectSchema<ObjectFromSchemas<Schemas>, Schemas>
/**
 * @category Reference
 *
 * * To use a Type-Driven approach, see {@link typed}
 *
 * @example
 * ```ts
 * const person = x.object('Person', { name: x.string })
 * assert(person.parse({ name: 'Jack' }).success === true)
 * assert(person.parse({ name: 42 }).success === false)
 * assert(person.name === 'Person')
 * ```
 */
export function object<S extends SchemasShape>(
  name: string,
  props: S,
): ObjectSchema<ObjectFromSchemas<S>, S>
export function object<S extends SchemasShape>(
  ...args: [name: string, props: S] | [props: S]
) {
  const [name, props] = args.length === 1 ? ['object', args[0]] : args
  return new Factory({
    name,
    props,
    parser: (input, context, self: any) => {
      if (!isObject(input)) return failure(context, name, input)

      const parsed = {} as ObjectFromSchemas<S>
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
  }) as unknown as ObjectSchema<ObjectFromSchemas<S>, S>
}
