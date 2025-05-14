/** @module */
import { defineIterableSchema } from './iterable'
import type { BaseSchema, Schema } from './Schema'
import type { SizedBuilder } from './SizedSchema'

/**
 * @category Schema Definition
 * @see {@link setOf}
 */
export interface SetSchema<T> extends BaseSchema<Set<T>>, SizedBuilder<Set<T>> {
  readonly item: Schema<T>
}

/**
 * Parses any iterable to an array.
 *
 * @category Schema
 * @see {@link SetSchema}
 * @see {@link tuple}
 * @see {@link array}
 * @see {@link mapOf}
 * @see {@link object}
 * @see {@link record}
 * @example
 * ```ts
 * const schema = x.setOf(x.string)
 *
 * assert.deepEqual(schema.parse(['a']).value, new Set(['a']))
 * assert.deepEqual(schema.parse(new Set(['a'])).value, new Set(['a']))
 *
 * assert(schema.parse([1]).success === false)
 * assert(schema.parse(1).success === false)
 * assert(schema.parse({}).success === false)
 * ```
 * @example Access the Set content schema with `.item`
 * ```ts
 * const schema = x.setOf(x.string)
 * assert(schema.item === x.string)
 * ```
 */
export function setOf<T>(itemSchema: BaseSchema<T>): SetSchema<T> {
  return defineIterableSchema(
    `Set<${itemSchema.name}>`,
    itemSchema,
    () => new Set<T>(),
    (acc, item) => acc.add(item),
    setOf.defaultMaxSize,
  ) as unknown as SetSchema<T>
}

/**
 * Allows to configure the default max size of Sets.
 *
 * The default value is intentionally low because safety-first.
 *
 * If you need to increase it, I recommend increasing it _locally_ at schema level:
 * `x.setOf(x.string).size({ max: 10_000 })`
 *
 * If you need to loosen it globally, use `x.setOf.defaultMaxSize = 10_000`
 *
 * @category Config
 * @see {@link setOf}
 * @default 100
 *
 * @example
 * ```ts
 * import { setOfSize } from './test-utils'
 *
 * x.setOf.defaultMaxSize = 20
 * const schema = x.setOf(x.string)
 *
 * assert(schema.parse(setOfSize(20)).success === true)
 * assert(schema.parse(setOfSize(21)).success === false)
 * ```
 * @example override default set max size locally
 * ```ts
 * import { setOfSize } from './test-utils'
 *
 * x.setOf.defaultMaxSize = 20
 * const schema = x.setOf(x.string).size({ min: 4, max: 25 })
 * assert(schema.parse(setOfSize(24)).success === true)
 * ```
 *
 * @example it keeps max when applying min:
 * ```ts
 * x.setOf.defaultMaxSize = 20
 * const schema = x.setOf(x.string).size({ min: 3 })
 *
 * assert(x.setOf(x.string).parse(new Array(12).fill('x')).success === true)
 *
 * assert(x.setOf(x.string).parse(new Array(2).fill('x')).success === false)
 * assert(x.setOf(x.string).parse(new Array(21).fill('x')).success === false)
 * ```
 */
setOf.defaultMaxSize = 100
