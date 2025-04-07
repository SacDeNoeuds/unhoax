import { createParseContext } from './ParseContext'
import type { Refinement } from './refine'
import { standardize, type Schema } from './Schema'

/**
 * @category Schema
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * type Tree = { left: Tree | null, right: Tree | null }
 *
 * const tree: x.ObjectSchema<Tree> = x.object({
 *   left: x.nullable(x.lazy(() => tree)),
 *   right: x.nullable(x.lazy(() => tree)),
 * })
 * ```
 */
export function lazy<T, Input = unknown>(getSchema: () => Schema<T, Input>) {
  let name = 'lazy'
  let refinements: Refinement[] | undefined
  return standardize<Schema<T, Input>>({
    get name() {
      return name
    },
    get refinements() {
      return refinements
    },
    parse: (input, context) => {
      const schema = getSchema()
      name = schema.name
      refinements = schema.refinements
      return schema.parse(
        input,
        context ?? createParseContext(schema.name, input),
      )
    },
  })
}
