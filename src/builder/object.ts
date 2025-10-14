import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { InputOf, Schema, TypeOf } from './Schema'
import { Factory, type SchemaLike } from './SchemaFactory'

export function isObject(input: unknown): input is Record<string, unknown> {
  // input.constructor is `undefined` for null-proto objects.
  return !!input && (input.constructor === Object || !input.constructor)
}

export type ObjectShape = Record<PropertyKey, any>

/**
 * @category Reference
 * @see {@link object}
 */
export interface ObjectSchema<T extends ObjectShape, S extends SchemasShape>
  extends Schema<{
    input: InputFromSchemas<S>
    output: T
    meta: { props: S }
  }> {}

type SchemasShape = Record<PropertyKey, SchemaLike<any, any>>

export type {
  SchemasShape as ObjectSchemasShape,
  OutputFromSchemas as OutputObjectFromSchemasShape,
}

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}
type OutputFromSchemas<S extends SchemasShape> = Simplify<
  {
    [Key in keyof S as undefined extends TypeOf<S[Key]> ? never : Key]: TypeOf<
      S[Key]
    >
  } & {
    [Key in keyof S as undefined extends TypeOf<S[Key]> ? Key : never]?: TypeOf<
      S[Key]
    >
  }
>
type InputFromSchemas<S extends SchemasShape> = Simplify<
  {
    [Key in keyof S as undefined extends InputOf<S[Key]>
      ? never
      : Key]: InputOf<S[Key]>
  } & {
    [Key in keyof S as undefined extends InputOf<S[Key]>
      ? Key
      : never]?: InputOf<S[Key]>
  }
>

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
): ObjectSchema<OutputFromSchemas<Schemas>, Schemas>
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
): ObjectSchema<OutputFromSchemas<S>, S>
export function object<S extends SchemasShape>(
  ...args: [name: string, props: S] | [props: S]
) {
  const [name, props] = args.length === 1 ? ['object', args[0]] : args
  return new Factory({
    name,
    props,
    parser: (input, context, self: any) => {
      if (!isObject(input)) return failure(context, name, input)

      const parsed = {} as OutputFromSchemas<S>
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
  }) as unknown as ObjectSchema<OutputFromSchemas<S>, S>
}
