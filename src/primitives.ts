import { fromPredicate } from "./fromPredicate";
import { map, type Schema } from "./Schema";

/**
 * @group Schema
 * @category Primitive
 */
export const boolean = fromPredicate(
  "boolean",
  (input) => typeof input === "boolean",
);

/**
 * @group Schema
 * @category Primitive
 */
export const untrimmedString = fromPredicate(
  "string",
  (input) => typeof input === "string",
);

const trim = map((str: string) => str.trim());
/**
 * @group Schema
 * @category Primitive
 */
export const string = trim(untrimmedString);

/**
 * This schema only accepts **finite** numbers for safety.<br>
 * If you need full control over your number, use `unsafeNumber` instead.
 *
 * Basically, it accepts anything passing the check `Number.isFinite`.
 *
 * @group Schema
 * @category Primitive
 * @see {@link unsafeNumber}
 */
export const number = fromPredicate<number>(
  "number",
  Number.isFinite as (input: unknown) => input is number,
);

/**
 * ⚠️ valid inputs are `Infinity`, `NaN` and unsafe integers.<br>
 * Basically, anything which passes the check `typeof x = 'number'`.
 *
 * @group Schema
 * @category Primitive
 * @see {@link number}
 */
export const unsafeNumber = fromPredicate<number>(
  "number",
  (input) => typeof input === "number",
);

/**
 * it accepts anything passing the check `Number.isSafeInteger`.
 *
 * @group Schema
 * @category Primitive
 * @see {@link number}
 * @see {@link unsafeInteger}
 * @see {@link unsafeNumber}
 */
export const integer = fromPredicate<number>(
  "integer",
  Number.isSafeInteger as (input: unknown) => input is number,
);
/**
 * it accepts anything passing the check `Number.isInteger`.
 *
 * @group Schema
 * @category Primitive
 * @see {@link integer}
 * @see {@link number}
 * @see {@link unsafeNumber}
 */
export const unsafeInteger = fromPredicate<number>(
  "unsafeInteger",
  Number.isInteger as (input: unknown) => input is number,
);

export type Literal = string | number | boolean | null | undefined;
const isLiteral =
  <L extends [Literal, ...Literal[]]>(...literals: L) =>
  (value: unknown): value is L[number] =>
    literals.some((literal) => value === literal);

/**
 * @group Schema Definition
 */
export interface LiteralSchema<L> extends Schema<L> {
  literals: L[];
}

/**
 * @group Schema
 * @category Primitive
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.literal('a') // Schema<'a'>
 *
 * const schema = x.literal('a', 42, true, null, undefined)
 * // Schema<'a' | 42 | true | null | undefined>
 * ```
 */
export function literal<L extends [Literal, ...Literal[]]>(
  ...literals: L
): LiteralSchema<L[number]> {
  return {
    ...fromPredicate("literal", isLiteral(...literals)),
    literals,
  };
}
