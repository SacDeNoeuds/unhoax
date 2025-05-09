import { isObject } from './object'
import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema } from './Schema'

/**
 * @category Schema Definition
 * @see {@link record}
 */
export interface RecordSchema<Key extends PropertyKey, Value>
  extends Schema<Record<Key, Value>> {
  readonly key: Schema<Key>
  readonly value: Schema<Value>
}

/**
 * @category Schema
 * @see {@link object}
 * @see {@link Map}
 * @see {@link array}
 * @see {@link Set}
 * @see {@link tuple}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const schema = x.record(x.string, x.number)
 * type MyRecord = x.TypeOf<typeof schema>
 *
 * schema.parse({ hello: 42 }) // { success: true, value: { hello: 42 } }
 * ```
 */
export function record<Key extends PropertyKey, Value>(
  key: Schema<Key>,
  value: Schema<Value>,
) {
  const name = `Record<${key.name}, ${value.name}>`
  return standardize<RecordSchema<Key, Value>>({
    name,
    refinements: [],
    key,
    value,
    parse: (input, context = createParseContext(name, input)) => {
      if (!isObject(input)) return failure(context, name, input)
      const acc = {} as Record<Key, Value>
      Object.entries(input).forEach(([k, v]) => {
        const ctx = withPathSegment(context, k as PropertyKey)
        const keyResult = key.parse(k, ctx)
        const itemResult = value.parse(v, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (keyResult.success && itemResult.success)
          acc[keyResult.value] = itemResult.value
      })
      return success(context, acc)
    },
  })
}
