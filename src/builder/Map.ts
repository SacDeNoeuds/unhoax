import { defineIterableSchema } from './iterable'
import type { BaseSchema } from './Schema'
import type { SizedBuilder } from './SizedSchema'
import { tuple, type TupleSchema } from './tuple'

/**
 * @category Reference
 * @see {@link mapOf}
 */
export interface MapSchema<Key, Value, Input>
  extends BaseSchema<Map<Key, Value>, Input>,
    SizedBuilder<Map<Key, Value>> {
  // readonly item: TupleSchema<[key: Schema<Key, any>, value: Schema<Value, any>]>
  readonly item: TupleSchema<[key: Key, value: Value], Input>
}

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
export function mapOf<Key, Value, KeyInput, ValueInput>(
  key: BaseSchema<Key, KeyInput>,
  value: BaseSchema<Value, ValueInput>,
): MapSchema<Key, Value, Iterable<[KeyInput, ValueInput]>> {
  const item = tuple(key, value)
  return defineIterableSchema(
    `Map<${key.name}, ${value.name}>`,
    item,
    () => new Map(),
    (acc, item) => acc.set(item[0], item[1]),
    mapOf.defaultMaxSize,
  ) as unknown as MapSchema<Key, Value, Iterable<[KeyInput, ValueInput]>>
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
 */
mapOf.defaultMaxSize = 100
