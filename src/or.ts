import { literal } from "./primitives";
import type { Schema } from "./Schema";
import { union } from "./union";

/**
 * @group Modifier
 * @see {@link union}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const orString = x.or(x.string)
 * const schema = orString(x.number) // Schema<number | string>
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const schema = pipe(x.number, x.or(x.string)) // Schema<number | string>
 */
export function or<B>(b: Schema<B>) {
  return <A>(a: Schema<A>) => union(a, b);
}

/**
 * Equivalent of `or(literal(undefined))` (see {@link or})
 * @group Modifier
 * @see {@link nil}
 * @see {@link nullable}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.optional(x.string) // Schema<string | undefined>
 */
export const optional = or(literal(undefined));

/**
 * Equivalent of `or(literal(undefined, null))` (see {@link or})
 * @group Modifier
 * @see {@link optional}
 * @see {@link nullable}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.nil(x.string) // Schema<string | undefined | null>
 */
export const nil = or(literal(undefined, null));

/**
 * Equivalent of `or(literal(null))` (see {@link or})
 * @group Modifier
 * @see {@link optional}
 * @see {@link nil}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.nullable(x.string) // Schema<string | null>
 */
export const nullable = or(literal(null));
