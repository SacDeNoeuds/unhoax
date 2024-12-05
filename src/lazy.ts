import { createParseContext } from './ParseContext'
import type { Schema } from './Schema'

/**
 * @category 2. Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * type Tree = { left: Tree | null, right: Tree | null }
 *
 * const tree: x.ObjectSchema<Tree> = x.object({
 *   left: x.nullable(x.lazy(() => tree)),
 *   right: x.nullable(x.lazy(() => tree)),
 * })
 * ```
 */
export function lazy<T>(getSchema: () => Schema<T>): Schema<T> {
  let name = 'lazy'
  let refinements: string[] | undefined
  return {
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
  }
}
