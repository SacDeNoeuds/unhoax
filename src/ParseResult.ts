import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ParseContext } from './ParseContext'

export type Success<T> = Extract<
  { readonly success: true; readonly value: T },
  StandardSchemaV1.SuccessResult<T>
>
export interface Failure extends ParseError {
  readonly success: false
}

/**
 * @category Parsing
 * @see {@link ParseError}
 * @see {@link ParseIssue}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const result = x.string.parse(someInput)
 * result:
 *  | { success: true, value: T }
 *  | { success: false, schemaName, input, issues }
 * ```
 */
export type ParseResult<T> = Extract<
  Success<T> | Failure,
  StandardSchemaV1.Result<T>
>

/**
 * @category Parsing
 * @see {@link ParseResult}
 * @see {@link ParseIssue}
 */
export type ParseError = Extract<
  {
    readonly schemaName: string
    readonly input: unknown
    readonly issues: ReadonlyArray<ParseIssue>
  },
  StandardSchemaV1.FailureResult
>

/**
 * @category Parsing
 * @see {@link ParseError}
 */
export type ParseIssue = Extract<
  {
    readonly schemaName: string
    readonly refinement?: string
    readonly input: unknown
    readonly message: string
    readonly path: PropertyKey[]
  },
  StandardSchemaV1.Issue
>

function makeMessage(issue: Omit<ParseIssue, 'message'>): string {
  const refinement = issue.refinement ? ` (${issue.refinement})` : ''
  const path = issue.path.length ? `At ${issue.path.join('.')}: ` : ''
  return `${path}not a ${issue.schemaName}${refinement}`
}

/**
 * @category Advanced Usage / Core
 * @see {@link ParseResult}
 * @see {@link createParseContext}
 * @example
 * ```ts
 * import { x } from 'unhoax'
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
  context.issues.push({
    input,
    schemaName,
    path: context.path,
    refinement,
    get message() {
      return makeMessage(this)
    },
  })
  return {
    success: false,
    input: context.rootInput,
    schemaName: context.rootSchemaName,
    issues: context.issues,
  }
}

/**
 * @category Advanced Usage / Core
 * @see {@link ParseResult}
 * @see {@link createParseContext}
 * @example
 * ```ts
 * import { x } from 'unhoax'
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
        input: context.rootInput,
        schemaName: context.rootSchemaName,
        issues: context.issues,
      }
}
