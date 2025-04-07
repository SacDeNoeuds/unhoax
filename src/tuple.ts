import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema } from './Schema'

/**
 * @category Schema Definition
 * @see {@link tuple}
 */
export interface TupleSchema<T, Input = unknown> extends Schema<T, Input> {
  readonly items: { [Key in keyof T]: Schema<T> }
}

/**
 * @category Schema
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const schema = x.tuple(x.string, x.number)
 * const result = schema.parse(['a', 1])
 * result // ['a', 1]
 * ```
 */
export function tuple<T extends [any, ...any[]], Input = unknown>(
  ...items: { [K in keyof T]: Schema<T[K]> }
) {
  const name = `[${items.map((schema) => schema.name).join(', ')}]`
  return standardize<TupleSchema<T, Input>>({
    name,
    items,
    parse: (input, context = createParseContext(name, input)) => {
      if (!Array.isArray(input)) return failure(context, name, input)
      if (input.length !== items.length) return failure(context, name, input)

      const tuple = input.flatMap((value, index) => {
        const itemSchema = items[index]!
        const ctx = withPathSegment(context, index)
        const result = itemSchema.parse(value, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result.success ? [result.value] : []
      })
      return success(context, tuple as T)
    },
  })
}
