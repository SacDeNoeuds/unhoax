import { fromGuard } from './from-guard'

/**
 * @category Schema
 * @example
 * ```ts
 * const schema = x.boolean
 * assert(x.boolean.parse(true).success === true)
 * assert(x.boolean.parse(false).success === true)
 *
 * assert(x.boolean.parse(1).success === false)
 * assert(x.boolean.parse('toto').success === false)
 * ```
 */
export const boolean = fromGuard(
  'boolean',
  (value) => typeof value === 'boolean',
)
