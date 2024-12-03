import { createParseContext, withPathSegment } from "./ParseContext";
import { failure, success } from "./ParseResult";
import type { Schema } from "./Schema";

/**
 * @group Schema Definition
 * @see {@link Map}
 */
export interface MapSchema<T extends Map<any, any>> extends Schema<T> {
  readonly key: Schema<MapKey<T>>;
  readonly value: Schema<MapValue<T>>;
}
type MapKey<T> = T extends Map<infer K, any> ? K : never;
type MapValue<T> = T extends Map<any, infer V> ? V : never;

export { Map_ as Map };

/**
 * @group Schema
 * @category Composite
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const nameByIdSchema = x.Map(x.number, x.string)
 *
 * const input = new Map([[1, 'Jack'], [2, 'Mary']])
 *
 * const result = nameByIdSchema.parse(input)
 * result // Map { 1 => 'Jack', 2 => 'Mary' }
 * ```
 */
function Map_<T extends Map<PropertyKey, any>>(
  key: Schema<MapKey<T>>,
  value: Schema<MapValue<T>>,
): MapSchema<T> {
  const name = `Map<${key.name}, ${value.name}>`;
  return {
    name,
    key,
    value,
    parse: (input, context = createParseContext(name, input)) => {
      if (!(input instanceof Map)) return failure(context, name, input);

      const acc = new Map() as T;
      input.forEach((v, k) => {
        const ctx = withPathSegment(context, k as PropertyKey);
        const keyResult = key.parse(k, ctx);
        const itemResult = value.parse(v, ctx);
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (keyResult.success && itemResult.success)
          acc.set(keyResult.value, itemResult.value);
      });
      return success(context, acc);
    },
  };
}
