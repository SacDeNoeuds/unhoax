import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

/**
 * @category Schema Definition
 * @see {@link Set}
 */
export interface SetSchema<T, Input = unknown> extends Schema<Set<T>, Input> {
  readonly item: Schema<T>
}

export { Set_ as Set }

/**
 * @category Schema
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.Set(x.string)
 * const result = schema.parse(new Set(['a', 'b']))
 * result // { success: true, value: Set { 'a', 'b' } }
 * ```
 */
function Set_<T, Input = unknown>(item: Schema<T>): SetSchema<T, Input> {
  const name = `Set<${item.name}>`
  return {
    name,
    item,
    parse: (input, context = createParseContext(name, input)) => {
      if (!(input instanceof Set)) return failure(context, name, input)
      const array = Array.from(input).flatMap((value, index) => {
        const ctx = withPathSegment(context, index)
        const result = item.parse(value, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result.success ? [result.value] : []
      })
      return success(context, new Set(array))
    },
  }
}
