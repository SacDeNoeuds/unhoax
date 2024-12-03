import { createParseContext } from "./ParseContext";
import { failure, success } from "./ParseResult";
import type { Schema } from "./Schema";

type Predicate<Input, T extends Input> = (input: Input) => input is T;

/**
 * Utility to create schemas.<br>
 * Can be used to create custom schemas like `Email`.
 * @category Schema Factory
 * @see {@link string}
 * @see {@link number}
 * @see {@link boolean}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const string = x.fromPredicate(
 *  'string',
 *  (input) => typeof input === 'string'
 * )
 *
 * // creating an email type:
 * type Email = string & { _tag: 'Email' }
 * declare const isEmail: (input: unknown) => input is Email
 *
 * const email = x.fromPredicate('Email', isEmail)
 * ```
 */
export function fromPredicate<T extends Input, Input = unknown>(
  name: string,
  predicate: Predicate<Input, T>,
): Schema<T, Input> {
  return {
    name,
    parse: (input, context = createParseContext(name, input)) =>
      predicate(input)
        ? success(context, input)
        : failure(context, name, input),
  };
}
