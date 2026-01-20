import type { ParseIssue } from './ParseResult'

/**
 * @category Advanced Usage / Core
 * @see {@link createParseContext}
 * @see {@link failure}
 * @see {@link success}
 */
export interface ParseContext {
  rootInput: unknown
  rootSchemaName: string
  path: PropertyKey[] // how nested we are. PropertyKey = string | number | symbol
  issues: ParseIssue[] // accumulated issues.
}

/**
 * @category Advanced Usage / Core
 * @see {@link ParseContext}
 * @see {@link failure}
 * @see {@link success}
 */
export function createParseContext(
  rootSchemaName: string,
  rootInput: unknown,
): ParseContext {
  return { rootSchemaName, rootInput, path: [], issues: [] }
}

export function withPathSegment<T>(
  context: ParseContext,
  segment: PropertyKey,
  run: (issueLessContext: ParseContext) => T,
): T {
  // explicitly DO NOT CLONE context.issues because errors are **pushed** to the same array.
  const issueLessContext: ParseContext = {
    rootInput: context.rootInput,
    rootSchemaName: context.rootSchemaName,
    path: [...context.path, segment],
    issues: [],
  }
  const result = run(issueLessContext)
  context.issues.push(...issueLessContext.issues)
  return result
}
