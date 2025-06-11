/** @module */
import { defineIterableSchema } from './iterable'
import type { BaseSchema, Schema } from './Schema'
import type { SizedBuilder } from './SizedSchema'

/**
 * @category Reference
 * @see {@link array}
 */
export interface ArraySchema<T> extends BaseSchema<T[]>, SizedBuilder<T[]> {
  readonly item: Schema<T>
}

/**
 * Parses any iterable to an array.
 *
 * @category Reference
 * @see {@link ArraySchema}
 * @see {@link tuple}
 * @see {@link Set}
 * @see {@link Map}
 * @see {@link object}
 * @see {@link record}
 * @example
 * ```ts
 * const schema = x.array(x.string)
 *
 * assert.deepEqual(schema.parse(['a']).value, ['a'])
 * assert.deepEqual(schema.parse(new Set(['a'])).value, ['a'])
 *
 * assert(schema.parse([1]).success === false)
 * assert(schema.parse(1).success === false)
 * assert(schema.parse({}).success === false)
 * ```
 * @example Access the array content schema with `.item`
 * ```ts
 * const schema = x.array(x.string)
 * assert(schema.item === x.string)
 * ```
 */
export function array<T>(itemSchema: BaseSchema<T>): ArraySchema<T> {
  return defineIterableSchema(
    `Array<${itemSchema.name}>`,
    itemSchema,
    () => [] as T[],
    (acc, item) => acc.push(item),
    array.defaultMaxSize,
  ) as ArraySchema<T>
}

/**
 * Allows to configure the default max length of arrays.
 *
 * The default value is intentionally low because safety-first.
 *
 * If you need to increase it, I recommend increasing it _locally_ at schema level:
 * `x.array(x.string).size({ max: 10_000 })`
 *
 * If you need to loosen it globally, use `x.array.defaultMaxSize = 10_000`
 *
 * @category Config – Safety Guards
 * @see {@link array}
 * @default 100
 *
 * @example
 * ```ts
 * x.array.defaultMaxSize = 20
 * const schema = x.array(x.string)
 *
 * assert(schema.parse(new Array(20).fill('x')).success === true)
 * assert(schema.parse(new Array(21).fill('x')).success === false)
 * ```
 * @example override array default max length locally
 * ```ts
 * x.array.defaultMaxSize = 20
 * const schema = x.array(x.string).size({ min: 4, max: 25 })
 * assert(schema.parse(new Array(24).fill('x')).success === true)
 * ```
 *
 * @example it keeps max when applying min:
 * ```ts
 * x.array.defaultMaxSize = 20
 * const schema = x.array(x.string).size({ min: 3 })
 *
 * assert(schema.parse(new Array(12).fill('x')).success === true)
 *
 * assert(schema.parse(new Array(2).fill('x')).success === false)
 * assert(schema.parse(new Array(21).fill('x')).success === false)
 * ```
 */
array.defaultMaxSize = 100
