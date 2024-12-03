import { createParseContext, type ParseContext } from "./ParseContext";
import { type ParseResult, success } from "./ParseResult";

/**
 * @category Schema Definition
 * @see {@link TypeOf}
 */
export interface Schema<T, Input = unknown> {
  readonly name: string;
  readonly refinements?: string[];
  /**
   * @category Parsing
   * @see {@link ParseResult}
   */
  readonly parse: (input: Input, context?: ParseContext) => ParseResult<T>;
}

/**
 * @category Schema Definition
 * @see {@link Schema}
 */
export type TypeOfSchema<T> = T extends Schema<infer U> ? U : never;

/** @ignore */
export function map<Input, Output>(mapper: (input: Input) => Output) {
  return <I = unknown>(schema: Schema<Input, I>): Schema<Output, I> => ({
    ...schema,
    parse: (input, context = createParseContext(schema.name, input)) => {
      const result = schema.parse(input, context);
      return result.success ? success(context, mapper(result.value)) : result;
    },
  });
}
