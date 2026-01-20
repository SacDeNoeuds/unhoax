import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { InputOf, Schema, TypeOf } from './Schema'
import { Factory, type SchemaLike } from './SchemaFactory'
import { isObject } from './object'

/**
 * @category Reference
 * @see {@link record}
 */
export interface RecordSchema<
  KeySchema extends SchemaLike<any, PropertyKey>,
  ValueSchema extends SchemaLike<any, any>,
> extends Schema<{
    input: Record<InputOf<KeySchema>, InputOf<ValueSchema>>
    output: Record<TypeOf<KeySchema>, TypeOf<ValueSchema>>
    meta: {
      key: KeySchema
      value: ValueSchema
    }
  }> {}

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
export function record<
  KeySchema extends SchemaLike<any, PropertyKey>,
  ValueSchema extends SchemaLike<any, any>,
>(key: KeySchema, value: ValueSchema): RecordSchema<KeySchema, ValueSchema> {
  const name = `Record<${key.name}, ${value.name}>`
  return new Factory({
    name,
    key,
    value,
    parser: (input, context) => {
      if (!isObject(input)) return failure(context, name, input)
      const acc = {} as Record<TypeOf<KeySchema>, TypeOf<ValueSchema>>
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
  }) as RecordSchema<KeySchema, ValueSchema>
}
