import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

export interface TupleSchema<T> extends Schema<T> {
  readonly items: { [Key in keyof T]: Schema<T> }
}
export function tuple<T extends [any, ...any[]]>(
  ...items: { [K in keyof T]: Schema<T[K]> }
): TupleSchema<T> {
  const name = `[${items.map((schema) => schema.name).join(", ")}]`
  return {
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
  }
}