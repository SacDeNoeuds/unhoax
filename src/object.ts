import { optional } from './or'
import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema, type TypeOfSchema } from './Schema'

export type PropsOf<T extends Record<string, any>> = {
  [Key in keyof T]: Schema<T[Key]>
}

export function isObject(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === 'object' && input !== null && input.constructor === Object
  )
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
): ObjectSchema<{ [Key in keyof T]: TypeOfSchema<T[Key]> }, Input>
/**
 * @category Schema
 * @see {@link record}
 * @see {@link partial}
 * @see {@link Map}
 * @see {@link array}
 * @see {@link Set}
 * @example Type-Driven – Named Schema
 * ```ts
 * import { x } from 'unhoax'
 *
 * type Person = { name: string, age: number }
 * const personSchema = x.object<Person>({
 *   name: x.string,
 *   age: x.number,
 * })
 * // you can also name the schema for better error readability
 * const personSchema = x.object<Person>('Person', { … })
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
 * import { x } from 'unhoax'
 *
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 *
 * const fullyOptional = partial(personSchema)
 * fullyOptional.parse({})
 * // { success: true, value: {} }
 *
 * const ageOptional = partial(personSchema, ['age'])
 * ageOptional.parse({ name: 'hello' })
 * // { success: true, value: { name: 'hello' } }
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
  const copy = {} as typeof schema.props
  Object.entries(schema.props).forEach(([key, schema]) => {
    copy[key] = keySet.has(key) ? optional(schema) : schema
  })
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
 * @example
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe'
 * 
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 * 
 * const schema = pipe(personSchema, x.omit('age'))
 * schema.parse({ name: 'hello' })
 * // { success: true, value: { name: 'hello' } }
 })
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
 * @example
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe'
 * 
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 * 
 * const schema = pipe(personSchema, x.pick('age'))
 * schema.parse({ age: 42 })
 * // { success: true, value: { age: 42 } }
 })
 * ```
 */
export const pick =
  <T extends Record<string, any>, Prop extends keyof T>(...props: Prop[]) =>
  (schema: ObjectSchema<T>): ObjectSchema<Pick<T, Prop>> =>
    object(pickProps(schema.props, props))
