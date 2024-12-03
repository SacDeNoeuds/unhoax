import { createParseContext } from "./ParseContext"
import { failure, success } from "./ParseResult"
import type { Schema } from "./Schema"

type Predicate<Input, T extends Input> = (input: Input) => input is T
export function fromPredicate<T extends Input, Input = unknown>(
  name: string,
  predicate: Predicate<Input, T>,
): Schema<T, Input> {
  return {
    name,
    parse: (input, context = createParseContext(name, input)) =>
      predicate(input)
        ? success(context, input)
        : failure(context, name, input),
  }
}
