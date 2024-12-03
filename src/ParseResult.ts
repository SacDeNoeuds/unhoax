import type { ParseContext } from "./ParseContext"

type Success<T> = { success: true; value: T }
type Failure = { success: false; error: ParseError }
export type ParseResult<T> = Success<T> | Failure

export interface ParseError {
  schemaName: string
  input: unknown
  issues: ParseIssue[]
}

export interface ParseIssue {
  schemaName: string
  refinement?: string
  input: unknown
  path: PropertyKey[]
}

export function failure(
  context: ParseContext,
  schemaName: string,
  input: unknown,
  refinement?: string
): Failure {
  context.issues.push({ input, schemaName, path: context.path, refinement })
  return {
    success: false,
    error: {
      input: context.rootInput,
      schemaName: context.rootSchemaName,
      issues: context.issues,
    },
  }
}
export function success<T>(context: ParseContext, value: T): ParseResult<T> {
  return context.issues.length === 0
    ? { success: true, value }
    : {
        success: false,
        error: {
          input: context.rootInput,
          schemaName: context.rootSchemaName,
          issues: context.issues,
        },
      }
}
