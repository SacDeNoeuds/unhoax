import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema, TypeOfSchema } from './Schema'

export interface Refinement {
  readonly name: string
  readonly meta?: Record<string, unknown>
}

// export type RefinementMeta = Record<string, unknown>
// export type Refinements = Map<string, RefinementMeta>

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe'
 *
 * declare const isEmail: (input: string) => boolean
 *
 * const emailSchema = pipe(
 *   x.string,
 *   x.refine('Email', isEmail),
 * ) // Schema<string>
 * ```
 * @example not using pipe
 * ```ts
 * import { x } from 'unhoax'
 *
 * const refineAsEmail = x.refine('Email', isEmail)
 * const emailSchema = refineAsEmail(x.string) // Schema<string>
 * ```
 */
export function refine<S extends Schema<any>>(
  name: string,
  refine: (value: TypeOfSchema<S>) => boolean,
  meta?: unknown,
): (schema: S) => S
export function refine<T, S extends Schema<T>>(
  name: string,
  refine: (value: T) => boolean,
  meta?: unknown,
): (schema: S) => S
export function refine<S extends Schema<any>>(
  name: string,
  refine: (value: TypeOfSchema<S>) => boolean,
  meta?: unknown,
) {
  return (schema: S): S => ({
    ...schema,
    refinements: [...(schema.refinements ?? []), { name, meta }],
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
 * import { x } from 'unhoax'
 *
 * type Email = string & { _tag: 'Email' }
 * declare const isEmail: (input: string) => input is Email
 *
 * const guardAsEmail = x.guardAs('Email', isEmail)
 * const emailSchema = guardAsEmail(x.string) // Schema<Email>
 *
 * // or, using pipe:
 * import pipe from 'just-pipe'
 *
 * const emailSchema = pipe(
 *   x.string,
 *   x.guardAs('Email', isEmail),
 * ) // Schema<Email>
 * ```
 */
export const guardAs = refine as <T, U extends T>(
  name: string,
  guard: (value: T) => value is U,
  meta?: unknown,
) => (schema: Schema<T>) => Schema<U>

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
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
// export function greaterThan<T extends { valueOf(): number }>(
//   min: T,
//   reason = `> ${min}`,
// ) {
//   return refine<T, Schema<T>>(
//     reason,
//     (value) => value.valueOf() > min.valueOf(),
//     { min },
//   )
// }

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * // works with dates
 * const refineNowOrAfter = x.min(new Date(), 'now or after')
 * const dateNowOrAfter = refineNowOrAfter(x.date)
 *
 * // works with numbers
 * const refineAsPositiveOrZero = x.min(0, 'PositiveOrZero')
 * const positiveOrZero = refineAsPositiveZero(x.number)
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const positiveOrZeroNumber = pipe(
 *   x.number,
 *   x.min(0, 'PositiveOrZero'),
 * ) // Schema<number>
 * ```
 */
export function min<T extends { valueOf(): number | bigint }>(
  min: T,
  reason = `>= ${min}`,
) {
  return refine<T, Schema<T>>(
    reason,
    (value) => value.valueOf() >= min.valueOf(),
    { min },
  )
}

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
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
// export function lowerThan<T extends { valueOf(): number }>(
//   max: T,
//   reason = `< ${max}`,
// ) {
//   return refine<T, Schema<T>>(
//     reason,
//     (value) => value.valueOf() < max.valueOf(),
//     { max },
//   )
// }

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * // works with dates
 * const refineNowOrBefore = x.max(new Date(), 'now or before')
 * const dateNowOrBefore = refineNowOrBefore(x.date)
 *
 * // works with numbers
 * const refineAsNegativeOrZero = x.max(0, 'Negative or zero')
 * const negativeOrZero = refineAsNegativeOrZero(x.number)
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const negativeNumber = pipe(
 *   x.number,
 *   x.max(0, 'NegativeOrZero'),
 * ) // Schema<number>
 * ```
 */
export function max<T extends { valueOf(): number | bigint }>(
  max: T,
  reason = `<= ${max}`,
) {
  return refine<T, Schema<T>>(
    reason,
    (value) => value.valueOf() <= max.valueOf(),
    { max },
  )
}

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
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
export function between<T extends { valueOf(): number | bigint }>(
  min: T,
  max: T,
  reason = `${min} <= T <= ${max}`,
) {
  return refine<T, Schema<T>>(
    reason,
    (value) =>
      value.valueOf() >= min.valueOf() && value.valueOf() <= max.valueOf(),
    { min, max },
  )
}

/**
 * Works on anything with a size or length property of type number.<br>
 * Commonly known: array, set, map and strings
 *
 * It could also be your own types.
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
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
 * import { x } from 'unhoax'
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
  reason?: string
}) {
  const reason = options.reason ?? `Size: ${options.min} - ${options.max}`
  const min = options.min ?? -1
  const max = options.max ?? Infinity

  return refine<T, Schema<T>>(
    reason,
    (value) => {
      const size: number = (value as any)?.length ?? (value as any)?.size
      return size >= min && size <= max
    },
    { min: options.min, max: options.max },
  )
}

/**
 * @category Refinement
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const pattern = x.pattern(/^https?:\/\/.+/)
 * const withUrlPattern = pattern(x.string)
 *
 * const url = withUrlPattern(x.string)
 * // Schema<string>
 * ```
 */
export function pattern(regexp: RegExp) {
  return refine<string, Schema<string>>('pattern', (s) => regexp.test(s), {
    regexp,
  })
}
