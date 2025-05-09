import type { Schema } from './Schema'

/**
 * @category Parsing
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const result = x.unsafeParse(x.string, 'hello')
 * // 'hello'
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
export function unsafeParse<T>(schema: Schema<T>, input: unknown): T {
  const result = schema.parse(input)
  if (result.success) return result.value
  throw new Error('ParseError', { cause: result })
}
