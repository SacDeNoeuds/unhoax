import { failure, ok } from '../common/ParseResult'
import { defineSchema, type Schema } from './Schema'

export type Guard<T> = (value: unknown) => value is T

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
export const fromGuard = <T>(name: string, guard: Guard<T>): Schema<T> => {
  return defineSchema<T>({
    name,
    parser: (input, context) => {
      return guard(input) ? ok(input) : failure(context, name, input)
    },
  })
}
