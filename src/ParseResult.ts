import type { ParseContext } from './ParseContext'

export type Success<T> = { success: true; value: T }
export type Failure = { success: false; error: ParseError }

/**
 * @category Parsing
 * @see {@link ParseError}
 * @see {@link ParseIssue}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const result = x.string.parse(someInput)
 * result:
 *  | { success: true, value: T }
 *  | { success: false, error: ParseError }
 * ```
 */
export type ParseResult<T> = Success<T> | Failure

/**
 * @category Parsing
 * @see {@link ParseResult}
 * @see {@link ParseIssue}
 */
export type ParseError = {
  schemaName: string
  input: unknown
  issues: ParseIssue[]
}

/**
 * @category Parsing
 * @see {@link ParseError}
 */
export type ParseIssue = {
  schemaName: string
  refinement?: string
  input: unknown
  path: PropertyKey[]
}

/**
 * @category Advanced Usage / Core
 * @see {@link ParseResult}
 * @see {@link createParseContext}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const customSchema: x.Schema<string> = {
 *   name: 'myType',
 *   parse: (input, context = createParseContext('myType', input)) => {
 *      if (typeof input === 'string') return x.success(context, input)
 *      else return x.failure(context, 'myType', input)
 *   }
 * }
 * ```
 */
export function failure(
  context: ParseContext,
  schemaName: string,
  input: unknown,
  refinement?: string,
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

/**
 * @category Advanced Usage / Core
 * @see {@link ParseResult}
 * @see {@link createParseContext}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const customSchema: x.Schema<string> = {
 *   name: 'myType',
 *   parse: (input, context = createParseContext('myType', input)) => {
 *      if (typeof input === 'string') return x.success(context, input)
 *      else return x.failure(context, 'myType', input)
 *   }
 * }
 * ```
 */
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
