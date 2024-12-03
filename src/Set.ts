import { createParseContext, withPathSegment } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

export interface SetSchema<T> extends Schema<Set<T>> {
  readonly item: Schema<T>
}

export { Set_ as Set }
function Set_<T>(item: Schema<T>): SetSchema<T> {
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