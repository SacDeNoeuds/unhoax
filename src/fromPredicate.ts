import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

type Predicate<T> = (input: unknown) => input is T
export function fromPredicate<T>(name: string, predicate: Predicate<T>): Schema<T> {
  return {
    name,
    parse: (input, context = createParseContext(name, input)) =>
      predicate(input)
        ? success(context, input)
        : failure(context, name, input),
  }
}

