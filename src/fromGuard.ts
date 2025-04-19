import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema } from './Schema'

export type Guard<Input, T extends Input> = (input: Input) => input is T

/**
 * Utility to create schemas.<br>
 * Used to create most of the primitives.<br>
 * Can be used to create custom schemas like `Email`.
 * @category Schema Factory
 * @see {@link bigint}
 * @see {@link boolean}
 * @see {@link instanceOf}
 * @see {@link integer}
 * @see {@link number}
 * @see {@link string}
 * @see {@link symbol}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const string = x.fromGuard(
 *  'string',
 *  (input) => typeof input === 'string'
 * )
 *
 * // creating an email type:
 * type Email = string & { _tag: 'Email' }
 * declare const isEmail: (input: unknown) => input is Email
 *
 * const email = x.fromGuard('Email', isEmail)
 * ```
 */
export function fromGuard<T extends Input, Input = unknown>(
  name: string,
  guard: Guard<Input, T>,
) {
  return standardize<Schema<T, Input>>({
    name,
    parse: (input, context = createParseContext(name, input)) =>
      guard(input) ? success(context, input) : failure(context, name, input),
  })
}
