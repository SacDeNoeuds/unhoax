import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema } from './Schema'

/**
 * @category Schema Definition
 * @see {@link Map}
 */
export interface MapSchema<T extends Map<any, any>, Input = unknown>
  extends Schema<T, Input> {
  readonly key: Schema<MapKey<T>>
  readonly value: Schema<MapValue<T>>
}
export type MapKey<T> = T extends Map<infer K, any> ? K : never
export type MapValue<T> = T extends Map<any, infer V> ? V : never

export { Map_ as Map }

/**
 * @category Schema
 * @see {@link object}
 * @see {@link record}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const nameByIdSchema = x.Map(x.number, x.string)
 *
 * const input = new Map([[1, 'Jack'], [2, 'Mary']])
 *
 * const result = nameByIdSchema.parse(input)
 * result // Map { 1 => 'Jack', 2 => 'Mary' }
 * ```
 */
function Map_<T extends Map<PropertyKey, any>, Input = unknown>(
  key: Schema<MapKey<T>>,
  value: Schema<MapValue<T>>,
) {
  const name = `Map<${key.name}, ${value.name}>`
  return standardize<MapSchema<T, Input>>({
    name,
    key,
    value,
    parse: (input, context = createParseContext(name, input)) => {
      if (!(input instanceof Map)) return failure(context, name, input)

      const acc = new Map() as T
      input.forEach((v, k) => {
        const ctx = withPathSegment(context, k as PropertyKey)
        const keyResult = key.parse(k, ctx)
        const itemResult = value.parse(v, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (keyResult.success && itemResult.success)
          acc.set(keyResult.value, itemResult.value)
      })
      return success(context, acc)
    },
  })
}
