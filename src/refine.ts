import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import type { Schema } from './Schema'

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

export const refineTo = refine as <T, U extends T>(
  name: string,
  predicate: (value: T) => value is U,
) => (schema: Schema<T>) => Schema<U>

export function greaterThan<T extends { valueOf(): number }>(
  min: T,
  reason: string,
) {
  return refine<T, Schema<T>>(reason, (value) => value.valueOf() > min.valueOf())
}
export function lowerThan<T extends { valueOf(): number }>(
  max: T,
  reason: string,
) {
  return refine<T, Schema<T>>(reason, (value) => value.valueOf() < max.valueOf())
}
export function between<T extends { valueOf(): number }>(
  min: T,
  max: T,
  reason: string,
) {
  return refine<T, Schema<T>>(reason, (value) => {
    return value.valueOf() > min.valueOf() && value.valueOf() < max.valueOf()
  })
}

export function nonEmpty<T extends { length: number } | { size: number }>(
  reason = "NonEmpty",
) {
  return size<T>({ min: 1, reason })
}

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
