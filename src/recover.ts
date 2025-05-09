import type { Schema } from './Schema'

/**
 * Allows to never fail from parsing an input by providing a lazy fallback.
 * @category Schema
 * @see {@link fallback} for usage without callback
 * @example
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe' // or from elsewhere
 *
 * const schema = pipe(x.number, x.recover(() => 'not a number'))
 *
 * schema.parse(42) // { success: true, value: 42 }
 * schema.parse('toto') // { success: true, value: 'not a number' }
 * ```
 * @example not using pipe
 * ```ts
 * import { x } from 'unhoax'
 *
 * const recoverFromNaN = x.recover(() => 'not a number')
 * const schema = recoverFromNaN(x.number)
 * ```
 */
export function recover<U>(getFallback: () => U) {
  return function recover<T>(schema: Schema<T>): Schema<T | U> {
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
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe' // or from elsewhere
 *
 * const schema = pipe(x.number, x.fallback('not a number'))
 *
 * schema.parse(42) // { success: true, value: 42 }
 * schema.parse('toto') // { success: true, value: 'not a number' }
 * ```
 * @example not using pipe
 * ```ts
 * import { x } from 'unhoax'
 *
 * const orString = x.fallback('not a number')
 * const schema = orString(x.number)
 * ```
 */
export function fallback<T>(fallback: T) {
  return recover(() => fallback)
}
