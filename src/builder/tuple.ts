import type { StandardSchemaV1 } from '@standard-schema/spec'
import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { TypeOf } from './main-barrel'
import type { BaseSchema, InputOf, Schema } from './Schema'
import { Factory } from './SchemaFactory'

/**
 * @category Reference
 * @see {@link tuple}
 */
export interface TupleSchema<T, Input> extends BaseSchema<T, Input> {
  // TODO: Schema is missing an `Input`, but it requires changing the TupleSchema signature.
  readonly items: { [Key in keyof T]: Schema<T[Key]> }
}

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
  T extends [StandardSchemaV1<any, any>, ...StandardSchemaV1<any, any>[]],
>(
  ...items: T
): TupleSchema<
  { [K in keyof T]: TypeOf<T[K]> },
  { [K in keyof T]: InputOf<T[K]> }
> {
  const tupleOfSchema = items as {
    [K in keyof T]: T[K] & BaseSchema<T[K], InputOf<T[K]>>
  }
  const name = `[${tupleOfSchema.map((schema) => schema.name).join(', ')}]`
  const schema = new Factory({
    name,
    parser: (input, context) => {
      if (!Array.isArray(input)) return failure(context, name, input)
      if (input.length < items.length) return failure(context, name, input)

      const tuple = tupleOfSchema.flatMap((itemSchema, index) => {
        const value = input[index]!
        const ctx = withPathSegment(context, index)
        const result = itemSchema.parse(value, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result.success ? [result.value] : []
      })
      return success(context, tuple as T)
    },
  })
  return Object.assign(schema, { items }) as unknown as TupleSchema<
    { [K in keyof T]: TypeOf<T[K]> },
    { [K in keyof T]: InputOf<T[K]> }
  >
}
