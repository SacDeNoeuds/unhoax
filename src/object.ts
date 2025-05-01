import { optional } from './or'
import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema, type TypeOfSchema } from './Schema'

export type PropsOf<T extends Record<string, any>> = {
  readonly [Key in keyof T]: Schema<T[Key]>
}
type Writable<T> = { -readonly [Key in keyof T]: T[Key] }

export function isObject(input: unknown): input is Record<string, unknown> {
  // input.constructor is `undefined` for null-proto objects.
  return !!input && (input.constructor === Object || !input.constructor)
}

/**
 * @category Schema Definition
 * @see {@link object}
 */
export interface ObjectSchema<T extends Record<string, any>, Input = unknown>
  extends Schema<T, Input> {
  readonly props: PropsOf<T>
}

/**
 * Providing a name improves readability of parse errors.
 *
 * @category Schema
 * @see {@link record}
 * @see {@link partial}
 * @see {@link Map}
 * @see {@link array}
 * @see {@link Set}
 * @example Type Inference – Named Schema
 * ```ts
 * import { x } from 'unhoax'
 *
 * // Use the schema as source of truth:
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 *
 * // you can also name the schema
 * const personSchema = x.object('Person', { … })
 * type Person = x.TypeOf<typeof personSchema>
 * ```
 */
export function object<T extends Record<string, Schema<any>>, Input = unknown>(
  ...args: [props: T] | [name: string, props: T]
): ObjectSchema<{ readonly [Key in keyof T]: TypeOfSchema<T[Key]> }, Input>
/**
 * @category Schema
 * @see {@link record}
 * @see {@link partial}
 * @see {@link Map}
 * @see {@link array}
 * @see {@link Set}
 * @see {@link omit}
 * @see {@link pick}
 * @see {@link intersect}
 * @example Type-Driven
 * ```ts
 * type Person = { name: string, age: number }
 * const personSchema = x.object<Person>({
 *   name: x.string,
 *   age: x.number,
 * })
 * ```
 * @example Naming a schema
 * ```ts
 * // you can also name the schema for better error readability
 * const personSchema = x.object<Person>('Person', { … })
 * ```
 * @example Circular objects with lazy getters
 * ```ts
 * type Person = { name: string, friends: Person[] }
 * const schema = x.object<Person>({
 *   name: x.string,
 *   get friends(): x.Schema<Person[]> {
 *     return x.array(schema)
 *   }
 * })
 * ```
 */
export function object<T extends Record<string, any>, Input = unknown>(
  ...args: [props: PropsOf<T>] | [name: string, props: PropsOf<T>]
): ObjectSchema<T, Input>
export function object<T extends Record<string, any>, Input = unknown>(
  ...args: [name: string, props: PropsOf<T>] | [props: PropsOf<T>]
) {
  const [name, props] = args.length === 1 ? ['object', args[0]] : args
  return standardize<ObjectSchema<T, Input>>({
    name,
    props,
    parse: (input, context = createParseContext(name, input)) => {
      if (!isObject(input)) return failure(context, name, input)

      const parsed = {} as T
      Object.entries(props).forEach(([key, schema]) => {
        const nestedContext = withPathSegment(context, key)
        // schema.parse pushes an issue if it fails
        const result = schema.parse(input[key], nestedContext)
        if (result.success) parsed[key as keyof T] = result.value
      })
      return success(context, parsed)
    },
  })
}

/**
 * @category Modifier
 * @see {@link object}
 * @example
 * ```ts
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 *
 * const fullyOptional = partial(personSchema)
 * fullyOptional.parse({}) // { success: true, value: {} }
 *
 * const ageOptional = partial(personSchema, ['age'])
 * ageOptional.parse({ name: 'hello' }) // { success: true, value: { name: 'hello' } }
 * ```
 */
export function partial<T extends Record<string, any>>(
  schema: ObjectSchema<T>,
): ObjectSchema<Partial<T>>
export function partial<T extends Record<string, any>, Key extends keyof T>(
  schema: ObjectSchema<T>,
  keys: Key[],
): ObjectSchema<Omit<T, Key> & Partial<Pick<T, Key>>>
export function partial(
  schema: ObjectSchema<Record<string, any>>,
  keys?: string[],
): ObjectSchema<Record<string, any>> {
  const keySet = new Set(keys ?? Object.keys(schema.props))
  const copy = {} as Writable<typeof schema.props>
  for (const key in schema.props) {
    const propSchema = schema.props[key]
    copy[key] = keySet.has(key) ? optional(propSchema) : propSchema
  }
  return object(copy)
}

const omitProps = <T extends Record<PropertyKey, any>, Prop extends keyof T>(
  object: T,
  props: Prop[],
): Omit<T, Prop> => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !props.includes(key as any)),
  ) as Omit<T, Prop>
}

/**
 * @see {@link object}
 * @see {@link pick}
 * @see {@link intersect}
 * @example
 * ```ts
 * const personSchema = x.object({ name: x.string, age: x.number })
 *
 * const schema = pipe(personSchema, x.omit('age'))
 * schema.parse({ name: 'hello' }) // { success: true, value: { name: 'hello' } }
 */
export const omit =
  <T extends Record<string, any>, Prop extends keyof T>(...props: Prop[]) =>
  (schema: ObjectSchema<T>): ObjectSchema<Omit<T, Prop>> =>
    object(omitProps(schema.props, props))

const pickProps = <T extends Record<PropertyKey, any>, Prop extends keyof T>(
  object: T,
  props: Prop[],
): Pick<T, Prop> => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => props.includes(key as any)),
  ) as Pick<T, Prop>
}

/**
 * @see {@link object}
 * @see {@link omit}
 * @see {@link intersect}
 * @example
 * ```ts
 * const personSchema = x.object({ name: x.string, age: x.number })
 * 
 * const schema = pipe(personSchema, x.pick('age'))
 * schema.parse({ age: 42 }) // { success: true, value: { age: 42 } }
 })
 * ```
 */
export const pick =
  <T extends Record<string, any>, Prop extends keyof T>(...props: Prop[]) =>
  (schema: ObjectSchema<T>): ObjectSchema<Pick<T, Prop>> =>
    object(pickProps(schema.props, props))

/**
 * @see {@link object}
 * @see {@link pick}
 * @see {@link omit}
 * @example
 * ```ts
 * const person = x.object({
 *   name: x.string,
 *   kind: x.literal('adult', 'child')
 * })
 * const developer = x.object({ name: x.string, kind: x.boolean })
 *
 * const schema = pipe(person, x.intersect(developer))
 * schema.parse({ name: 'Me', kind: true })
 * // { success: true, value: { name: 'Me', kind: true } }
 *
 * schema.parse({ name: 'Me', kind: 'adult' })
 * // Fails, expected `kind` to be `boolean` (from developer)
 })
 * ```
 */
export const intersect =
  <B extends Record<string, any>>(b: ObjectSchema<B>) =>
  <A extends Record<string, any>>(a: ObjectSchema<A>) =>
    object({ ...a.props, ...b.props })
