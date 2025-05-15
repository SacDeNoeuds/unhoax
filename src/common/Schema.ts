import type { ParseContext } from './ParseContext'
import type { ParseResult } from './ParseResult'

export type TypeOf<T> = T extends {
  parse(...args: any[]): ParseResult<infer U>
}
  ? U
  : never

export interface SchemaLike<T> {
  readonly name: string
  readonly refinements?: Record<string, Refinement<T>>
  parse(input: unknown, context?: ParseContext): ParseResult<T>
}

export type SchemaMeta = Record<string, Record<string, unknown>>
export interface Refinement<T> {
  refine: (value: T, config: Omit<Refinement<T>, 'refine'>) => boolean
  [Key: string]: unknown
}
