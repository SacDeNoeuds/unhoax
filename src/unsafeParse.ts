import type { Schema } from "./Schema";

/**
 * @group Parsing
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const result = x.unsafeParse(x.string, 'hello')
 * result // 'hello'
 *
 * try {
 *   x.unsafeParse(x.number, 'hello')
 * } catch (error) {
 *   error // Error
 *   error.cause // x.ParseError
 *   error.cause.issues // x.ParseIssue[]
 * }
 * ```
 */
export function unsafeParse<T, Input = unknown>(
  schema: Schema<T, Input>,
  input: Input,
): T {
  const result = schema.parse(input);
  if (result.success) return result.value;
  throw new Error("ParseError", { cause: result.error });
}
