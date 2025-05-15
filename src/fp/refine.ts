import type { Refinement } from '../common/Schema'
import { defineSchema, type Schema } from './Schema'

/**
 * @example
 * ```ts
 * import { isCapitalized } from './test-utils'
 *
 * const capitalized = pipe(
 *   x.string,
 *   x.refine('capitalized', isCapitalized),
 * )
 * assert(capitalized.parse('hey').success === false)
 * assert(capitalized.parse('Hey').success === true)
 * ```
 */
export function refine<T, Meta extends Omit<Refinement<T>, 'refine'>>(
  name: string,
  refine: (value: T, config: Meta) => boolean,
  config?: Meta,
) {
  return (schema: Schema<T>): Schema<T> =>
    defineSchema<T>({
      ...schema,
      refinements: {
        ...schema.refinements,
        [name]: { ...config, refine },
      },
    } as any)
}
