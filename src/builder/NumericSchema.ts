import type { Numeric } from '../common/Numeric'
import type { Schema } from './Schema'

/**
 * Utilities for every numeric schemas like `x.bigint`, `x.date` and `x.number`.
 *
 * @see {@link bigint}
 * @see {@link date}
 * @see {@link number}
 */
export interface NumericBuilder<T extends Numeric> {
  /**
   * @category Reference
   * @alias of {@link gte}
   * @example number
   * ```ts
   * const schema = x.number.min(42)
   * assert(schema.parse(42).success === true)
   * assert(schema.parse(41).success === false)
   * ```
   * @example Date
   * ```ts
   * const schema = x.date.min(new Date(2025))
   * assert(schema.parse(new Date(2025)).success === true)
   * assert(schema.parse(new Date(2024)).success === false)
   * ```
   * @example bigint
   * ```ts
   * const schema = x.bigint.min(10n)
   * assert(schema.parse(10n).success === true)
   * assert(schema.parse(9n).success === false)
   * ```
   * @example meta
   * ```ts
   * const schema = x.number.min(18, 'threshold in percent')
   * assert(schema.refinements?.min.value === 18)
   * assert(schema.refinements?.min.description === 'threshold in percent')
   * assert(schema.refinements?.min.exclusive === false)
   * ```
   */
  min(min: T, description?: string): Schema<T>

  /**
   * @category Reference
   * @alias of {@link min}
   */
  gte(number: T, description?: string): Schema<T>
  /**
   * @alias of {@link gt}
   * @example number
   * ```ts
   * const schema = x.number.greaterThan(42)
   * assert(schema.parse(43).success === true)
   * assert(schema.parse(42).success === false)
   * ```
   * * @example Date
   * ```ts
   * const schema = x.date.greaterThan(new Date(2025))
   * assert(schema.parse(new Date(2025, 1)).success === true)
   * assert(schema.parse(new Date(2025)).success === false)
   * ```
   * @example bigint
   * ```ts
   * const schema = x.bigint.greaterThan(42n)
   * assert(schema.parse(43n).success === true)
   * assert(schema.parse(42n).success === false)
   * ```
   * @example meta
   * ```ts
   * const schema = x.number.greaterThan(22, 'threshold in percent')
   * assert(schema.refinements?.min.value === 22)
   * assert(schema.refinements?.min.description === 'threshold in percent')
   * assert(schema.refinements?.min.exclusive === true)
   * ```
   */
  greaterThan(number: T, description?: string): Schema<T>
  /**
   * @category Reference
   * @alias of {@link greaterThan}
   */
  gt(number: T, description?: string): Schema<T>
  /**
   * @category Reference
   * @alias of {@link lte}
   * @example number
   * ```ts
   * const schema = x.number.max(42)
   * assert(schema.parse(42).success === true)
   * assert(schema.parse(43).success === false)
   * ```
   * @example Date
   * ```ts
   * const schema = x.date.max(new Date(2025))
   * assert(schema.parse(new Date(2025)).success === true)
   * assert(schema.parse(new Date(2025, 0, 1)).success === false)
   * ```
   * @example bigint
   * ```ts
   * const schema = x.bigint.max(42n)
   * assert(schema.parse(42n).success === true)
   * assert(schema.parse(43n).success === false)
   * ```
   * @example meta
   * ```ts
   * const schema = x.number.max(22, 'threshold in percent')
   * assert(schema.refinements?.max.value === 22)
   * assert(schema.refinements?.max.description === 'threshold in percent')
   * assert(schema.refinements?.max.exclusive === false)
   * ```
   */
  max(max: T, description?: string): Schema<T>
  /**
   * @category Reference
   * @alias of {@link max}
   */
  lte(number: T, description?: string): Schema<T>
  /**
   * @category Reference
   * @alias of {@link lt}
   * @example number
   * ```ts
   * const schema = x.number.lowerThan(42)
   * assert(schema.parse(41).success === true)
   * assert(schema.parse(42).success === false)
   * ```
   * @example Date
   * ```ts
   * const schema = x.date.lowerThan(new Date(2025))
   * assert(schema.parse(new Date(2024)).success === true)
   * assert(schema.parse(new Date(2025)).success === false)
   * ```
   * @example bigint
   * ```ts
   * const schema = x.bigint.lowerThan(42n)
   * assert(schema.parse(41n).success === true)
   * assert(schema.parse(42n).success === false)
   * ```
   * @example meta
   * ```ts
   * const schema = x.number.lowerThan(22, 'threshold in percent')
   * assert(schema.refinements?.max.value === 22)
   * assert(schema.refinements?.max.description === 'threshold in percent')
   * assert(schema.refinements?.max.exclusive === true)
   * ```
   */
  lowerThan(number: T, description?: string): Schema<T>
  /**
   * @category Reference
   * @alias of {@link lowerThan}
   */
  lt(number: T, description?: string): Schema<T>
}
