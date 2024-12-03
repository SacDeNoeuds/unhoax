import { createParseContext, type ParseContext } from "./ParseContext"
import { type ParseResult, success } from "./ParseResult"

export interface Schema<T> {
  readonly name: string
  readonly refinements?: string[]
  readonly parse: (input: unknown, context?: ParseContext) => ParseResult<T>
}

export type TypeOfSchema<T> = T extends Schema<infer U> ? U : never

export function map<Input, Output>(mapper: (input: Input) => Output) {
  return (schema: Schema<Input>): Schema<Output> => ({
    ...schema,
    parse: (input, context = createParseContext(schema.name, input)) => {
      const result = schema.parse(input, context)
      return result.success ? success(context, mapper(result.value)) : result
    },
  })
}
