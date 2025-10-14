import { defineIterableSchema } from './iterable'
import type { InputOf, Schema, TypeOf } from './Schema'
import type { SchemaLike } from './SchemaFactory'
import type { SizedSchemaRefiners } from './SizedSchemaRefiners'
import { tuple, type TupleSchema } from './tuple'

/**
 * @category Reference
 * @see {@link mapOf}
 */
export interface MapSchema<
  KeySchema extends SchemaLike<any, any>,
  ValueSchema extends SchemaLike<any, any>,
> extends Schema<{
      input: Iterable<[key: InputOf<KeySchema>, value: InputOf<ValueSchema>]>
      output: Map<TypeOf<KeySchema>, TypeOf<ValueSchema>>
      meta: { item: TupleSchema<[KeySchema, ValueSchema]> }
    }>,
    SizedSchemaRefiners {}

/**
 * @category Reference
 * @see {@link object}
 * @see {@link record}
 * @see {@link array}
 * @see {@link setOf}
 * @see {@link tuple}
 * @example
 * ```ts
 * const schema = x.mapOf(x.number, x.string)
 *
 * const entries = [[1, 'Jack'], [2, 'Mary']]
 * const map = new Map(entries)
 *
 * assert.deepEqual(
 *   schema.parse(entries), // it parses entries
 *   { success: true, value: map },
 * )
 * assert.deepEqual(
 *   schema.parse(map), // it parses a map
 *   { success: true, value: map },
 * )
 *
 * assert(schema.parse([['1', 'Jack']]).success === false)
 * assert(schema.parse([['Jack', 1]]).success === false)
 * ```
 */
export function mapOf<
  KeySchema extends SchemaLike<any, any>,
  ValueSchema extends SchemaLike<any, any>,
>(key: KeySchema, value: ValueSchema): MapSchema<KeySchema, ValueSchema> {
  const item = tuple(key, value)
  return defineIterableSchema(
    `Map<${key.name}, ${value.name}>`,
    item,
    () => new Map(),
    (acc, item) => acc.set(item[0], item[1]),
    mapOf.defaultMaxSize,
  ) as MapSchema<KeySchema, ValueSchema>
}

/**
 * Allows to configure the default max size of Maps.
 *
 * The default value is intentionally low because safety-first.
 *
 * If you need to increase it, I recommend increasing it _locally_ at schema level:
 * `x.mapOf(x.string, x.string).size({ max: 10_000 })`
 *
 * If you need to loosen it globally, use `x.mapOf.defaultMaxSize = 10_000`
 *
 * @category Config – Safety Guards
 * @see {@link mapOf}
 * @default 100
 *
 * @example
 * ```ts
 * import { mapOfSize } from './test-utils'
 *
 * x.mapOf.defaultMaxSize = 20
 * const schema = x.mapOf(x.string, x.string)
 *
 * assert(schema.parse(mapOfSize(20)).success === true)
 * assert(schema.parse(mapOfSize(21)).success === false)
 * ```
 * @example override default max size locally
 * ```ts
 * import { mapOfSize } from './test-utils'
 *
 * x.mapOf.defaultMaxSize = 20
 * const schema = x.mapOf(x.string, x.string).size({ max: 25 })
 * assert(schema.parse(mapOfSize(24)).success === true)
 * ```
 *
 * @example it keeps max when applying min:
 * ```ts
 * import { mapOfSize } from './test-utils'
 *
 * x.mapOf.defaultMaxSize = 20
 * const schema = x.mapOf(x.string).size({ min: 3 })
 *
 * assert(schema.parse(mapOfSize(12)).success === true)
 *
 * assert(schema.parse(mapOfSize(2)).success === false)
 * assert(schema.parse(mapOfSize(21)).success === false)
 * ```
 *
 * @example the rule is **not** retro-active
 * ```ts
 * x.mapOf.defaultMaxSize = 100
 * const schema = x.mapOf(x.string).size({ min: 3 })
 *
 * assert(schema.parse(mapOfSize(21)).success === true)
 *
 * x.mapOf.defaultMaxSize = 20
 * assert(schema.parse(mapOfSize(21)).success === true)
 * ```
 */
mapOf.defaultMaxSize = 500
