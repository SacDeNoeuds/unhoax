import { fromPredicate } from "./fromPredicate"
import { map, type Schema } from "./Schema"

export const boolean = fromPredicate(
  "boolean",
  (input) => typeof input === "boolean",
)

export const untrimmedString = fromPredicate(
  "string",
  (input) => typeof input === "string",
)

const trim = map((str: string) => str.trim())
export const string = trim(untrimmedString)

export const number = fromPredicate<number>(
  "number",
  Number.isFinite as (input: unknown) => input is number,
)
export const integer = fromPredicate<number>(
  "integer",
  Number.isInteger as (input: unknown) => input is number,
)

type Literal = string | number | boolean | null | undefined
const isLiteral =
  <L extends [Literal, ...Literal[]]>(...literals: L) =>
  (value: unknown): value is L[number] =>
    literals.some((literal) => value === literal)

export interface LiteralSchema<L> extends Schema<L> {
  literals: L[]
}

export function literal<L extends [Literal, ...Literal[]]>(
  ...literals: L
): LiteralSchema<L[number]> {
  return {
    ...fromPredicate("literal", isLiteral(...literals)),
    literals,
  }
}
