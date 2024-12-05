import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

/**
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * declare const isEmail: (input: string) => input is string
 *
 * const refineAsEmail = x.refine('Email', isEmail)
 * const emailSchema = refineAsEmail(x.string) // Schema<string>
 *
 * // or, using pipe:
 * import pipe from 'just-pipe'
 *
 * const emailSchema: Schema<string> = pipe(
 *   x.string,
 *   x.refine('Email', isEmail),
 * )
 * ```
 */
export function refine<T, S extends Schema<T>>(
  name: string,
  refine: (value: T) => boolean,
) {
  return (schema: S): S => ({
    ...schema,
    refinements: [...(schema.refinements ?? []), name],
    parse: (input, context = createParseContext(schema.name, input)) => {
      const result = schema.parse(input, context)
      if (!result.success) return result
      return refine(result.value)
        ? success(context, result.value)
        : failure(context, schema.name, input, name)
    },
  })
}

/**
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * type Email = string & { _tag: 'Email' }
 * declare const isEmail: (input: string) => input is Email
 *
 * const refineAsEmail = x.refineAs('Email', isEmail)
 * const emailSchema = refineAsEmail(x.string) // Schema<Email>
 *
 * // or, using pipe:
 * import pipe from 'just-pipe'
 *
 * const emailSchema: Schema<Email> = pipe(
 *   x.string,
 *   x.refineAs('Email', isEmail),
 * )
 * ```
 */
export const refineAs = refine as <T, U extends T>(
  name: string,
  predicate: (value: T) => value is U,
) => (schema: Schema<T>) => Schema<U>

/**
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * // works with dates
 * const refineAfterNow = x.greaterThan(new Date(), 'after now')
 * const dateAfterNow = refineAfterNow(x.date)
 *
 * // works with numbers
 * const refineAsPositive = x.greaterThan(0, 'Positive')
 * const positiveNumber = refineAsPositive(x.number)
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const positiveNumber = pipe(
 *   x.number,
 *   x.greaterThan(0, 'Positive'),
 * ) // Schema<number>
 * ```
 */
export function greaterThan<T extends { valueOf(): number }>(
  min: T,
  reason: string,
) {
  return refine<T, Schema<T>>(
    reason,
    (value) => value.valueOf() > min.valueOf(),
  )
}

/**
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * // works with dates
 * const refineBeforeNow = x.lowerThan(new Date(), 'before now')
 * const dateBeforeNow = refineBeforeNow(x.date)
 *
 * // works with numbers
 * const refineAsNegative = x.lowerThan(0, 'Negative')
 * const negativeNumber = refineAsNegative(x.number)
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const negativeNumber = pipe(
 *   x.number,
 *   x.lowerThan(0, 'Negative'),
 * ) // Schema<number>
 * ```
 */
export function lowerThan<T extends { valueOf(): number }>(
  max: T,
  reason: string,
) {
  return refine<T, Schema<T>>(
    reason,
    (value) => value.valueOf() < max.valueOf(),
  )
}

/**
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * // works with dates
 * declare const today: Date
 * declare const nextMonth: Date
 * const refineInCurrentMonth = x.between(today, nextMonth, 'In current month')
 * const dateInCurrentMonth = refineInCurrentMonth(x.date)
 *
 * // works with numbers
 * const refineAsStarRating = x.between(0, 5, 'StarRating')
 * const starRating = refineAsStarRating(x.number)
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const starRating = pipe(
 *   x.number,
 *   x.between(0, 5, 'StarRating'),
 * ) // Schema<number>
 * ```
 */
export function between<T extends { valueOf(): number }>(
  min: T,
  max: T,
  reason: string,
) {
  return refine<T, Schema<T>>(reason, (value) => {
    return value.valueOf() > min.valueOf() && value.valueOf() < max.valueOf()
  })
}

/**
 * Works on anything with a size or length property of type number.<br>
 * Commonly known: array, set, map and strings
 *
 * It could also be your own types.
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 * import pipe from 'just-pipe'
 *
 * // With a Set
 * const nonEmpty = x.nonEmpty('optional reason')
 * const mySet = nonEmpty(x.Set(x.string)) // SetSchema<string>
 * // or, using pipe:
 * const mySet = pipe(x.string, x.Set, x.nonEmpty()) // SetSchema<string>
 *
 * // With a string
 * const firstName = x.nonEmpty('NonEmpty')(x.string) // Schema<string>
 *
 * class LinkedList<T> {
 *   get length(): number { … }
 *   static fromArray = <T>(array: T[]): LinkedList<T> => { … }
 * }
 *
 * // With a custom type
 * const LinkedListSchema = <T>(itemSchema: Schema<T>) => pipe(
 *   x.array(itemSchema),
 *   x.map(LinkedList.fromArray),
 *   x.nonEmpty('NonEmpty'),
 * ) // Schema<LinkedList<T>>
 * ```
 */
export function nonEmpty<T extends { length: number } | { size: number }>(
  reason = 'NonEmpty',
) {
  return size<T>({ min: 1, reason })
}

/**
 * Works on anything with a size or length property of type number.<br>
 * Commonly known: array, set, map and strings
 *
 * It could also be your own types.
 * @category Refinement
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * // With a Set
 * const mySet = x.size({ min: 1, max: 10, reason: 'My sets are small' })
 * // or, using pipe:
 * const mySet = pipe(x.string, x.Set, x.size({ min: 1, max: 10, reason: 'My sets are small' }))
 *
 * // With a string
 * const firstName = x.size({ min: 1, max: 80, reason: 'FirstNameConstraints' })
 *
 * // With a custom type:
 * class Vector<T> {
 *   x: number
 *   y: number
 *
 *   get length(): number { … }
 *   static fromPosition = ({ x: number, y: number }): Vector => …
 * }
 *
 * const vectorSchema = pipe(
 *   x.object({ x: x.number, y: x.number }),
 *   x.map(Vector.fromPosition),
 *   x.size({ min: 1, max: 10, reason: 'My vectors are small' }),
 * ) // Schema<LinkedList<T>>
 * ```
 */
export function size<T extends { size: number } | { length: number }>(options: {
  min?: number
  max?: number
  reason: string
}) {
  return refine<T, Schema<T>>(options.reason, (value) => {
    const size: number = (value as any)?.length ?? (value as any)?.size
    const min = options.min ?? -Infinity
    const max = options.max ?? Infinity
    return size >= min && size <= max
  })
}
