/** @module */
import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

/**
 * @category Schema Definition
 * @see {@link array}
 */
export interface ArraySchema<T, Input = unknown> extends Schema<T[]> {
  readonly item: Schema<T, Input>
}

/**
 * @category Schema
 * @see {@link ArraySchema}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const schema = x.array(x.string)
 * const result = schema.parse(['a', 'b'])
 * ```
 */
export function array<T, Input = unknown>(
  itemSchema: Schema<T>,
): ArraySchema<T, Input> {
  const name = `Array<${itemSchema.name}>`
  return {
    name,
    item: itemSchema,
    parse: (input, context = createParseContext(name, input)) => {
      if (!Array.isArray(input)) return failure(context, name, input)

      const parsed: T[] = []
      input.forEach((value, index) => {
        const nestedContext = withPathSegment(context, index)
        // schema.parse pushes an issue if it fails
        const result = itemSchema.parse(value, nestedContext)
        if (result.success) parsed.push(result.value)
      })
      return success(context, parsed)
    },
  }
}
