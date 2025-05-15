import type { Numeric } from '../common/Numeric'
import { refine } from './refine'

/**
 * @alias of {@link gte}
 * @example number
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.min(42),
 * )
 * assert(schema.parse(42).success === true)
 * assert(schema.parse(41).success === false)
 * ```
 * @example Date
 * ```ts
 * const schema = pipe(
 *   x.date,
 *   x.min(new Date(2025)),
 * )
 * assert(schema.parse(new Date(2025)).success === true)
 * assert(schema.parse(new Date(2024)).success === false)
 * ```
 * @example bigint
 * ```ts
 * const schema = pipe(
 *   x.bigint,
 *   x.min(10n),
 * )
 * assert(schema.parse(10n).success === true)
 * assert(schema.parse(9n).success === false)
 * ```
 * @example meta
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.min(18, 'threshold in percent'),
 * )
 * assert.partialDeepStrictEqual(schema.refinements?.min, {
 *   value: 18,
 *   description: 'threshold in percent',
 *   exclusive: false,
 * })
 * ```
 */
export const min = gte

/** @alias of {@link min} */
export function gte<T extends Numeric>(number: T, description?: string) {
  return refine('min', (value: T) => value >= number, {
    value: number,
    description,
    exclusive: false,
  })
}
/**
 * @alias of {@link gt}
 * @example number
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.greaterThan(42),
 * )
 * assert(schema.parse(43).success === true)
 * assert(schema.parse(42).success === false)
 * ```
 * * @example Date
 * ```ts
 * const schema = pipe(
 *   x.date,
 *   x.greaterThan(new Date(2025)),
 * )
 * assert(schema.parse(new Date(2025, 1)).success === true)
 * assert(schema.parse(new Date(2025)).success === false)
 * ```
 * @example bigint
 * ```ts
 * const schema = pipe(
 *   x.bigint,
 *   x.greaterThan(42n),
 * )
 * assert(schema.parse(43n).success === true)
 * assert(schema.parse(42n).success === false)
 * ```
 * @example meta
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.greaterThan(22, 'threshold in percent'),
 * )
 * assert.partialDeepStrictEqual(schema.refinements?.min, {
 *   value: 22,
 *   description: 'threshold in percent',
 *   exclusive: true,
 * })
 * ```
 */
export const greaterThan = gt
/** * @alias of {@link greaterThan} */
export function gt<T extends Numeric>(number: T, description?: string) {
  return refine('min', (value: T) => value > number, {
    value: number,
    description,
    exclusive: true,
  })
}
/**
 * @alias of {@link lte}
 * @example number
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.max(42),
 * )
 * assert(schema.parse(42).success === true)
 * assert(schema.parse(43).success === false)
 * ```
 * @example Date
 * ```ts
 * const schema = pipe(
 *   x.date,
 *   x.max(new Date(2025)),
 * )
 * assert(schema.parse(new Date(2025)).success === true)
 * assert(schema.parse(new Date(2025, 0, 1)).success === false)
 * ```
 * @example bigint
 * ```ts
 * const schema = pipe(
 *   x.bigint,
 *   x.max(42n),
 * )
 * assert(schema.parse(42n).success === true)
 * assert(schema.parse(43n).success === false)
 * ```
 * @example meta
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.max(22, 'threshold in percent'),
 * )
 * assert.partialDeepStrictEqual(schema.refinements?.max, {
 *   value: 22,
 *   description: 'threshold in percent',
 *   exclusive: false,
 * })
 * ```
 */
export const max = lte
/** * @alias of {@link max} */
export function lte<T extends Numeric>(number: T, description?: string) {
  return refine('max', (value: T) => value <= number, {
    value: number,
    description,
    exclusive: false,
  })
}
/**
 * @alias of {@link lt}
 * @example number
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.lowerThan(42),
 * )
 * assert(schema.parse(41).success === true)
 * assert(schema.parse(42).success === false)
 * ```
 * @example Date
 * ```ts
 * const schema = pipe(
 *   x.date,
 *   x.lowerThan(new Date(2025)),
 * )
 * assert(schema.parse(new Date(2024)).success === true)
 * assert(schema.parse(new Date(2025)).success === false)
 * ```
 * @example bigint
 * ```ts
 * const schema = pipe(
 *   x.bigint,
 *   x.lowerThan(42n),
 * )
 * assert(schema.parse(41n).success === true)
 * assert(schema.parse(42n).success === false)
 * ```
 * @example meta
 * ```ts
 * const schema = pipe(
 *   x.number,
 *   x.lowerThan(22, 'threshold in percent'),
 * )
 * assert.partialDeepStrictEqual(schema.refinements?.max, {
 *   value: 22,
 *   description: 'threshold in percent',
 *   exclusive: true,
 * })
 * ```
 */
export const lowerThan = lt
/** @alias of {@link lowerThan} */
export function lt<T extends Numeric>(number: T, description?: string) {
  return refine('max', (value: T) => value < number, {
    value: number,
    description,
    exclusive: true,
  })
}
