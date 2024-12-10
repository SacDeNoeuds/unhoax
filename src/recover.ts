import type { Schema } from './Schema'

/**
 * Allows to never fail from parsing an input by providing a fallback.
 * @category Schema
 * @see {@link fallback} for usage without callback
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const orString = x.recover(() => 'not a number')
 * const schema = orString(x.number)
 * schema.parse(42) // { success: true, value: 42 }
 * schema.parse('toto') // { success: true, value: 'not a number' }
 * ```
 */
export function recover<U>(getFallback: () => U) {
  return function recover<T, Input = unknown>(
    schema: Schema<T, Input>,
  ): Schema<T | U, Input> {
    return {
      ...schema,
      parse: (input) => {
        const result = schema.parse(input)
        return result.success ? result : { success: true, value: getFallback() }
      },
    }
  }
}

/**
 * Built on top of {@link recover}
 * @category Schema
 * @see {@link recover}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const orString = x.fallback('not a number')
 * const schema = orString(x.number)
 * schema.parse(42) // { success: true, value: 42 }
 * schema.parse('toto') // { success: true, value: 'not a number' }
 * ```
 */
export function fallback<T>(fallback: T) {
  return recover(() => fallback)
}
