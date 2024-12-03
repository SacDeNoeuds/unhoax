import type { ObjectSchema } from "./object";
import { createParseContext } from "./ParseContext";
import { failure, success } from "./ParseResult";
import type { LiteralSchema } from "./primitives";
import type { Schema, TypeOfSchema } from "./Schema";

/**
 * @category Schema Definition
 * @see {@link union}
 * @see {@link discriminatedUnion}
 */
export interface UnionSchema<T> extends Schema<T> {
  readonly schemas: Schema<unknown>[];
}
function namedUnion<T extends [Schema<any>, ...Schema<any>[]]>(
  name: string,
  schemas: T,
): UnionSchema<TypeOfSchema<T[number]>> {
  return {
    name,
    schemas,
    refinements: [],
    parse: (input, context = createParseContext(name, input)) => {
      for (const schema of schemas) {
        const result = schema.parse(input);
        if (result.success) return success(context, result.value);
      }
      return failure(context, name, input);
    },
  };
}

/**
 * If you want to use a discriminated union, checkout {@link discriminatedUnion}
 *
 * @category Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.union(x.string, x.number) // Schema<string | number>
 * const result = schema.parse('a')
 * result // { success: true, value: 'a' }
 * ```
 */
export function union<T extends [Schema<any>, ...Schema<any>[]]>(
  ...schemas: T
): UnionSchema<TypeOfSchema<T[number]>> {
  const name = schemas.map((schema) => schema.name).join(" | ");
  return namedUnion(name, schemas);
}

// /**
//  * @group Schema Definition
//  * @see {@link discriminatedUnion}
//  */
// export interface DiscriminatedUnionSchema<Discriminant, T>
//   extends UnionSchema<T> {
//   discriminant: Discriminant;
// }

/**
 * If you need to use a simple union, checkout {@link union}
 *
 * @category Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const a = x.object({ type: x.literal('a'), a: x.string }),
 * const b = x.object({ type: x.literal('b'), b: x.number }),
 *
 * const schema = x.discriminatedUnion([a, b], 'type')
 * // Schema<{ type: 'a', a: string } | { type: 'b', b: number }>
 *
 * const result = schema.parse({ type: 'a', a: 'Hello' })
 * result // { success: true, value: { type: 'a', a: 'Hello' } }
 * ```
 */
export function discriminatedUnion<
  T extends [ObjectSchema<any>, ...ObjectSchema<any>[]],
>(
  schemas: T,
  discriminant: keyof T[number]["props"],
): UnionSchema<TypeOfSchema<T[number]>> {
  const name = schemas
    .map(
      (schema) =>
        (schema.props[discriminant] as LiteralSchema<string>)?.literals[0] ??
        schema.name,
    )
    .join(" | ");
  return namedUnion(name, schemas);
}
