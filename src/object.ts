import { optional } from './or'
import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema, TypeOfSchema } from './Schema'

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
 * @see {@link Map}
 * @see {@link partial}
 * @example Type Inference – Named Schema
 * ```ts
 * import * as x from 'unhoax'
 *
 * // Use the schema as source of truth:
 * const personSchema = x.object('Person', {
 *   name: x.string,
 *   age: x.number,
 * })
 * type Person = x.TypeOf<typeof personSchema>
 * ```
 */
export function object<T extends Record<string, Schema<any>>, Input = unknown>(
  name: string,
  props: T,
): ObjectSchema<{ [Key in keyof T]: TypeOfSchema<T[Key]> }, Input>
/**
 * @category Schema
 * @see {@link record}
 * @see {@link Map}
 * @see {@link partial}
 * @example Type Inference – Unnamed Schema
 * ```ts
 * import * as x from 'unhoax'
 *
 * // Use the schema as source of truth:
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 * type Person = x.TypeOf<typeof personSchema>
 * ```
 */
export function object<T extends Record<string, Schema<any>>, Input = unknown>(
  props: T,
): ObjectSchema<{ [Key in keyof T]: TypeOfSchema<T[Key]> }, Input>
/**
 * @category Schema
 * @see {@link partial}
 * @see {@link record}
 * @see {@link Map}
 * @example Type-Driven – Named Schema
 * ```ts
 * import * as x from 'unhoax'
 *
 * type Person = { name: string, age: number }
 * const personSchema = x.object<Person>('Person', {
 *   name: x.string,
 *   age: x.number,
 * })
 * ```
 */
export function object<T extends Record<string, any>, Input = unknown>(
  name: string,
  props: PropsOf<T>,
): ObjectSchema<T, Input>
/**
 * @category Schema
 * @see {@link partial}
 * @see {@link record}
 * @see {@link Map}
 * @example Type-Driven – Unnamed Schema
 * ```ts
 * import * as x from 'unhoax'
 *
 * type Person = { name: string, age: number }
 * const personSchema = x.object<Person>({
 *   name: x.string,
 *   age: x.number,
 * })
 * ```
 */
export function object<T extends Record<string, any>, Input = unknown>(
  props: PropsOf<T>,
): ObjectSchema<T, Input>
export function object<T extends Record<string, any>, Input = unknown>(
  ...args: [string, PropsOf<T>] | [PropsOf<T>]
): ObjectSchema<T, Input> {
  const [name, props] = args.length === 1 ? ['object', args[0]] : args
  return {
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
  }
}

/**
 * @category Modifier
 * @see {@link object}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 *
 * const fullyOptional = partial(personSchema)
 * const result = fullyOptional.parse({})
 * result // { success: true, value: {} }
 *
 * const ageOptional = partial(personSchema, ['age'])
 * const result = ageOptional.parse({ name: 'hello' })
 * result // { success: true, value: { name: 'hello' } }
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
