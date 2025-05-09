import { createParseContext } from './ParseContext'
import type { Refinement } from './refine'
import { standardize, type Schema } from './Schema'

/**
 * @category Schema
 * @example Prefer getters when possible
 * ```ts
 * type Tree = { left: Leaf | Tree, right: Leaf | Tree }
 * type Leaf = string;
 *
 * const tree = x.object<Tree>({
 *   get left(): x.Schema<Leaf | Tree> {
 *     return x.union(x.string, tree)
 *   },
 *   get right(): x.Schema<Leaf | Tree> {
 *     return x.union(x.string, tree)
 *   },
 * })
 * ```
 * @example using `x.lazy()`
 * ```ts
 * type Tree = { left: Tree | Leaf, right: Tree | Leaf }
 * type Leaf = string;
 *
 * const tree: x.ObjectSchema<Tree> = x.object({
 *   left: x.lazy(() => x.union(x.string, tree)),
 *   right: x.lazy(() => x.union(x.string, tree)),
 * })
 * ```
 */
export function lazy<T>(getSchema: () => Schema<T>) {
  let name = 'lazy'
  let refinements: Refinement[] | undefined
  return standardize<Schema<T>>({
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
