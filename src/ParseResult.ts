import type { ParseContext } from "./ParseContext";

type Success<T> = { success: true; value: T };
type Failure = { success: false; error: ParseError };

/**
 * @group Parsing
 * @see {@link ParseError}
 * @see {@link ParseIssue}
 * @example
 * ```ts
 * const result = mySchema.parse(someInput)
 * result:
 *  | { success: true, value: T }
 *  | { success: false, error: ParseError }
 * ```
 */
export type ParseResult<T> = Success<T> | Failure;

/**
 * @group Parsing
 * @see {@link ParseResult}
 * @see {@link ParseIssue}
 */
export interface ParseError {
  schemaName: string;
  input: unknown;
  issues: ParseIssue[];
}

/**
 * @group Parsing
 * @see {@link ParseError}
 */
export interface ParseIssue {
  schemaName: string;
  refinement?: string;
  input: unknown;
  path: PropertyKey[];
}

export function failure(
  context: ParseContext,
  schemaName: string,
  input: unknown,
  refinement?: string,
): Failure {
  context.issues.push({ input, schemaName, path: context.path, refinement });
  return {
    success: false,
    error: {
      input: context.rootInput,
      schemaName: context.rootSchemaName,
      issues: context.issues,
    },
  };
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
      };
}
