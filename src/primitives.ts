import { fromPredicate } from "./fromPredicate"
import { refine } from "./refine"
import { map, type Schema } from "./Schema"

export const boolean = fromPredicate<boolean>(
  "boolean",
  (input) => typeof input === "boolean",
)

export const untrimmedString = fromPredicate<string>(
  "string",
  (input) => typeof input === "string",
)

const trim = map((str: string) => str.trim())
export const string = trim(untrimmedString)

const unsafeNumber = fromPredicate<number>(
  "number",
  (input) => typeof input === "number",
)
const notNaN = refine("NotNaN", (n: number) => !Number.isNaN(n))
export const number = notNaN(unsafeNumber)

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
