import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import { standardize, type Schema } from './Schema'

export type Guard<T> = (input: unknown) => input is T

/**
 * Utility to create schemas.<br>
 * Used to create most of the primitives.<br>
 * Can be used to create custom schemas like `Email`.
 *
 * @category Schema Factory
 * @see {@link bigint}
 * @see {@link boolean}
 * @see {@link instanceOf}
 * @see {@link integer}
 * @see {@link number}
 * @see {@link string}
 * @see {@link symbol}
 * @example rebuilding `x.string`
 * ```ts
 * const string = x.fromGuard(
 *  'string',
 *  (input) => typeof input === 'string'
 * )
 * ```
 * @example creating an email type
 * ```ts
 * type Email = string & { _tag: 'Email' }
 * declare const isEmail: (input: unknown) => input is Email
 *
 * const email = x.fromGuard('Email', isEmail)
 * ```
 */
export function fromGuard<T>(name: string, guard: Guard<T>) {
  return standardize<Schema<T>>({
    name,
    parse: (input, context = createParseContext(name, input)) =>
      guard(input) ? success(context, input) : failure(context, name, input),
  })
}
