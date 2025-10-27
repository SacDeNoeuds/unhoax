import type { StandardSchemaV1 } from '@standard-schema/spec'
import { createParseContext, type ParseContext } from '../common/ParseContext'
import { failure, ok, success, type ParseResult } from '../common/ParseResult'
import type { Refinement, SchemaLike, SchemaMeta } from '../common/Schema'

export interface SchemaConfig<T> {
  readonly name: string
  readonly parser: (
    input: unknown,
    context: ParseContext,
    self: Schema<T>,
  ) => ParseResult<T>
  readonly meta?: SchemaMeta
  readonly refinements?: Record<string, Refinement<T>>
}

export interface Schema<T>
  extends SchemaLike<T>,
    Omit<SchemaConfig<T>, 'parser'>,
    StandardSchemaV1<unknown, T> {
  defaultMaxSize?: number // for sized schemas
}

export function defineSchema<T>(conf: SchemaConfig<T>): Schema<T> {
  const parse = (
    input: unknown,
    context = createParseContext(conf.name, input),
  ) => {
    const result = conf.parser(input, context, conf as unknown as Schema<T>)
    if (!result.success) return failure(context, conf.name, input)
    for (const key in conf.refinements)
      if (!conf.refinements[key].refine(result.value, conf.refinements[key]))
        return failure(context, conf.name, result.value, {
          name: key,
          meta: {},
        })

    return success(context, result.value)
  }
  return Object.assign(conf, {
    ['~standard']: {
      vendor: 'unhoax',
      version: 1 as const,
      validate: parse,
    },
    parse,
  })
}

export const unknown = defineSchema({
  name: 'unknown',
  parser: ok,
})
