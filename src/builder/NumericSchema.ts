import type { Schema } from './Schema'

export type Numeric = { valueOf(): number | bigint }

export interface NumericBuilder<T extends Numeric> {
  /**
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
   * @example meta
   * ```ts
   * const schema = x.number.min(18, 'threshold in percent')
   * assert.partialDeepStrictEqual(schema.refinements?.min, {
   *   value: 18,
   *   description: 'threshold in percent',
   *   exclusive: false,
   * })
   * ```
   */
  min(min: T, description?: string): Schema<T>

  /** @alias of {@link min} */
  gte(number: T, description?: string): Schema<T>
  /**
   * @alias of {@link gt}
   * @example
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
   * @example meta
   * ```ts
   * const schema = x.number.greaterThan(22, 'threshold in percent')
   * assert.partialDeepStrictEqual(schema.refinements?.min, {
   *   value: 22,
   *   description: 'threshold in percent',
   *   exclusive: true,
   * })
   * ```
   */
  greaterThan(number: T, description?: string): Schema<T>
  /** * @alias of {@link greaterThan} */
  gt(number: T, description?: string): Schema<T>
  /**
   * @alias of {@link lte}
   * @example
   * ```ts
   * const schema = x.number.max(42)
   * assert(schema.parse(42).success === true)
   * assert(schema.parse(43).success === false)
   * ```
   * @example meta
   * ```ts
   * const schema = x.number.max(22, 'threshold in percent')
   * assert.partialDeepStrictEqual(schema.refinements?.max, {
   *   value: 22,
   *   description: 'threshold in percent',
   *   exclusive: false,
   * })
   * ```
   */
  max(max: T, description?: string): Schema<T>
  /** * @alias of {@link max} */
  lte(number: T, description?: string): Schema<T>
  /**
   * @alias of {@link lt}
   * @example
   * ```ts
   * const schema = x.number.lowerThan(42)
   * assert(schema.parse(41).success === true)
   * assert(schema.parse(42).success === false)
   * ```
   * @example meta
   * ```ts
   * const schema = x.number.lowerThan(22, 'threshold in percent')
   * assert.partialDeepStrictEqual(schema.refinements?.max, {
   *   value: 22,
   *   description: 'threshold in percent',
   *   exclusive: true,
   * })
   * ```
   */
  lowerThan(number: T, description?: string): Schema<T>
  /** @alias of {@link lowerThan} */
  lt(number: T, description?: string): Schema<T>
}
