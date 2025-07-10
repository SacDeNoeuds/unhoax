import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { BaseSchema, Schema } from './Schema'
import { Factory } from './SchemaFactory'
import { isObject } from './object'

/**
 * @category Reference
 * @see {@link record}
 */
export interface RecordSchema<
  Key extends PropertyKey,
  Value,
  Input = Record<Key, Value>,
> extends BaseSchema<Record<Key, Value>, Input> {
  readonly key: Schema<Key>
  readonly value: Schema<Value>
}

/**
 * @category Reference
 * @see {@link object}
 * @see {@link mapOf}
 * @see {@link array}
 * @see {@link setOf}
 * @see {@link tuple}
 * @example
 * ```ts
 * const schema = x.record(x.string.convertTo(x.number, Number), x.string)
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
  key: BaseSchema<Key>,
  value: BaseSchema<Value>,
): RecordSchema<Key, Value> {
  const name = `Record<${key.name}, ${value.name}>`
  const schema = new Factory({
    name,
    parser: (input, context) => {
      if (!isObject(input)) return failure(context, name, input)
      const acc = {} as Record<Key, Value>
      Object.entries(input).forEach(([k, v]) => {
        const ctx = withPathSegment(context, k as PropertyKey)
        const keyResult = key.parse(k, ctx)
        const itemResult = value.parse(v, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (keyResult.success && itemResult.success)
          // @ts-ignore
          acc[keyResult.value] = itemResult.value
      })
      return success(context, acc)
    },
  })
  return Object.assign(schema, { key, value }) as unknown as RecordSchema<
    Key,
    Value
  >
}
