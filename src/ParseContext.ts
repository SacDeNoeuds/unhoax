import type { ParseIssue } from "./ParseResult";

/** @ignore */
export interface ParseContext {
  rootInput: unknown;
  rootSchemaName: string;
  path: PropertyKey[]; // how nested we are. PropertyKey = string | number | symbol
  issues: ParseIssue[]; // accumulated issues.
}
export function createParseContext(
  rootSchemaName: string,
  rootInput: unknown,
): ParseContext {
  return { rootSchemaName, rootInput, path: [], issues: [] };
}

export function withPathSegment(
  context: ParseContext,
  segment: PropertyKey,
): ParseContext {
  // explicitly DO NOT CLONE context.issues because errors are **pushed** to the same array.
  return { ...context, path: [...context.path, segment] };
}
