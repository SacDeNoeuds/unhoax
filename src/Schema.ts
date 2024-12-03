import { createParseContext, type ParseContext } from "./ParseContext"
import { type ParseResult, success } from "./ParseResult"

export interface Schema<T, Input = unknown> {
  readonly name: string
  readonly refinements?: string[]
  readonly parse: (input: Input, context?: ParseContext) => ParseResult<T>
}

export type TypeOfSchema<T> = T extends Schema<infer U> ? U : never

export function map<Input, Output>(mapper: (input: Input) => Output) {
  return <I = unknown>(schema: Schema<Input, I>): Schema<Output, I> => ({
    ...schema,
    parse: (input, context = createParseContext(schema.name, input)) => {
      const result = schema.parse(input, context)
      return result.success ? success(context, mapper(result.value)) : result
    },
  })
}
