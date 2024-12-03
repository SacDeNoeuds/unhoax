import type { Schema } from './Schema'

export function unsafeParse<T>(schema: Schema<T>, input: unknown): T {
  const result = schema.parse(input)
  if (result.success) return result.value
  throw new Error('ParseError', { cause: result.error })
}
