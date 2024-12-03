/** @module */
import { optional } from "./or";
import { createParseContext, withPathSegment } from "./ParseContext";
import { failure, success } from "./ParseResult";
import type { Schema, TypeOfSchema } from "./Schema";

type PropsOf<T extends Record<string, any>> = {
  [Key in keyof T]: Schema<T[Key]>;
};

export function isObject(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === "object" && input !== null && input.constructor === Object
  );
}

/**
 * @group Schema Definition
 * @see {@link object}
 */
export interface ObjectSchema<T extends Record<string, any>> extends Schema<T> {
  readonly props: PropsOf<T>;
}

/**
 * @group Schema
 * @category Composite
 * @see {@link partial}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * // from a specific type:
 * type Person = { name: string, age: number }
 * const personSchema = h.object<Person>({
 *   name: x.string,
 *   age: x.number,
 * })
 *
 * // to generate a type:
 * const personSchema = x.object({
 *   name: x.string,
 *   age: x.number,
 * })
 * type Person = x.TypeOf<typeof personSchema>
 *
 * // intersect:
 * const personWithAddressSchema = x.object({
 *   ...personSchema.props,
 *   address: x.string,
 * })
 *
 * // omit:
 * import omit from 'just-omit'
 *
 * const personWithNoAgeSchema = x.object(
 *   omit(personSchema.props, ['age'])
 * )
 *
 * // pick
 * import pick from 'just-pick'
 *
 * const personWithName = x.object(
 *   pick(personSchema.props, ['name'])
 * )
 * ```
 */
export function object<T extends Record<string, Schema<any>>>(
  props: T,
  name?: string,
): ObjectSchema<{ [Key in keyof T]: TypeOfSchema<T[Key]> }>;
export function object<T extends Record<string, any>>(
  props: PropsOf<T>,
  name?: string,
): ObjectSchema<T>;
export function object<T extends Record<string, any>>(
  props: PropsOf<T>,
  name?: string,
): ObjectSchema<T> {
  name ||= "object";
  return {
    name,
    props,
    parse: (input, context = createParseContext(name, input)) => {
      if (!isObject(input)) return failure(context, name, input);

      const parsed = {} as T;
      Object.entries(props).forEach(([key, schema]) => {
        const nestedContext = withPathSegment(context, key);
        // schema.parse pushes an issue if it fails
        const result = schema.parse(input[key], nestedContext);
        if (result.success) parsed[key as keyof T] = result.value;
      });
      return success(context, parsed);
    },
  };
}

/**
 * @group Modifier
 * @category object
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
): ObjectSchema<Partial<T>>;
export function partial<T extends Record<string, any>, Key extends keyof T>(
  schema: ObjectSchema<T>,
  keys: Key[],
): ObjectSchema<Omit<T, Key> & Partial<Pick<T, Key>>>;
export function partial(
  schema: ObjectSchema<Record<string, any>>,
  keys?: string[],
): ObjectSchema<Record<string, any>> {
  const keySet = new Set(keys ?? Object.keys(schema.props));
  const copy = {} as typeof schema.props;
  Object.entries(schema.props).forEach(([key, schema]) => {
    copy[key] = keySet.has(key) ? optional(schema) : schema;
  });
  return object(copy);
}
