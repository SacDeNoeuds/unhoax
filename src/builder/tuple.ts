import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { TypeOf } from './main-barrel'
import type { InputOf, Schema } from './Schema'
import { Factory, type SchemaLike } from './SchemaFactory'

/**
 * @category Reference
 * @see {@link tuple}
 */
export interface TupleSchema<
  S extends [SchemaLike<any, any>, ...SchemaLike<any, any>[]],
> extends Schema<{
    input: { [K in keyof S]: InputOf<S[K]> }
    output: { [K in keyof S]: TypeOf<S[K]> }
    meta: { items: S }
  }> {}

/**
 * @category Reference
 * @see {@link array}
 * @see {@link setOf}
 * @see {@link mapOf}
 * @see {@link object}
 * @example
 * ```ts
 * const schema = x.tuple(x.string, x.number)
 * assert.deepEqual(
 *   schema.parse(['a', 1]),
 *   { success: true, value: ['a', 1] },
 * )
 *
 * assert.deepEqual(
 *   schema.parse(['a', 1, 2, 3, 4, 5]),
 *   { success: true, value: ['a', 1] },
 * )
 *
 * assert(schema.parse([1, 2]).success === false)
 *
 * assert(schema.items[0] === x.string)
 * assert(schema.items[1] === x.number)
 * ```
 * @example failures
 * ```ts
 * const schema = x.tuple(x.string, x.number)
 * assert(schema.parse(['1']).success === false)
 * assert(schema.parse(new Set(['1', 2])).success === false)
 * assert(schema.parse(new Map()).success === false)
 * assert(schema.parse({ 0: '1', 1: 2 }).success === false)
 * assert(schema.parse({ 0: '1', 1: 2, length: 2 }).success === false)
 * ```
 */
export function tuple<
  S extends [SchemaLike<any, any>, ...SchemaLike<any, any>[]],
>(...items: S): TupleSchema<S> {
  const name = `[${items.map((schema) => schema.name).join(', ')}]`
  return new Factory({
    name,
    items,
    parser: (input, context) => {
      if (!Array.isArray(input)) return failure(context, name, input)
      if (input.length < items.length) return failure(context, name, input)

      const tuple = items.flatMap((itemSchema, index) => {
        const value = input[index]!
        const result = withPathSegment(context, index, (ctx) =>
          itemSchema.parse(value, ctx),
        )
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result.success ? [result.value] : []
      })
      return success(context, tuple as S)
    },
  }) as TupleSchema<S>
}
