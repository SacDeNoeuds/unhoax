import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import { type Schema, defineSchema } from './Schema'
import { isObject } from './object'

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
 * const numberFromString = pipe(x.string, x.convertTo(x.number, Number))
 * const schema = x.record(numberFromString, x.string)
 * type MyRecord = x.TypeOf<typeof schema>
 *
 * assert.deepEqual(
 *   schema.parse({ 42: 'hello' }),
 *   { success: true, value: { 42: 'hello' } },
 * )
 * assert(schema.parse({ hello: 42 }).success === false)
 * assert(schema.parse({ hello: 'world' }).success === false)
 * ```
 * @example failures
 * ```ts
 * const schema = x.record(x.string, x.number)
 * assert(schema.parse([]).success === false)
 * assert(schema.parse(new Set()).success === false)
 * assert(schema.parse(new Map()).success === false)
 * assert(schema.parse({ 1: '12' }).success === false)
 * ```
 */
export function record<Key extends PropertyKey, Value>(
  key: Schema<Key>,
  value: Schema<Value>,
): RecordSchema<Key, Value> {
  const name = `Record<${key.name}, ${value.name}>`
  const schema = defineSchema<Record<Key, Value>>({
    name,
    parser: (input, context) => {
      if (!isObject(input)) return failure(context, name, input)
      const acc = {} as Record<Key, Value>
      Object.entries(input).forEach(([k, v]) => {
        const keyResult = withPathSegment(context, k as PropertyKey, (ctx) =>
          key.parse(k, ctx),
        )
        const itemResult = withPathSegment(context, k as PropertyKey, (ctx) =>
          value.parse(v, ctx),
        )
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (keyResult.success && itemResult.success)
          // @ts-ignore
          acc[keyResult.value] = itemResult.value
      })
      return success(context, acc)
    },
  })
  return Object.assign(schema, { key, value }) as RecordSchema<Key, Value>
}
