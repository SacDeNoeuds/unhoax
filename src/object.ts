import { createParseContext, withPathSegment } from "./ParseContext"
import { failure, success } from "./ParseResult"
import type { Schema } from './Schema'

type PropsOf<T extends Record<string, any>> = {
  [Key in keyof T]: Schema<T[Key]>
}

export function isObject(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === "object" && input !== null && input.constructor === Object
  )
}

export interface ObjectSchema<T extends Record<string, any>> extends Schema<T> {
  readonly props: PropsOf<T>
}

export function object<T extends Record<string, any>>(
  props: PropsOf<T>,
  name?: string
): ObjectSchema<T> {
  name ||= "object"
  return {
    name,
    props,
    parse: (input, context = createParseContext(name, input)) => {
      if (!isObject(input)) return failure(context, name, input)

      const parsed = {} as T
      Object.entries(props).forEach(([key, schema]) => {
        const nestedContext = withPathSegment(context, key)
        // schema.parse pushes an issue if it fails
        const result = schema.parse(input[key], nestedContext)
        if (result.success) parsed[key as keyof T] = result.value
      })
      return success(context, parsed)
    },
  }
}
