import type { StandardSchemaV1 } from '@standard-schema/spec'
import { createParseContext, type ParseContext } from './ParseContext'
import type { Failure, ParseResult } from './ParseResult'
import type { Refinement } from './refine'

const vendor = 'unhoax'
const version = 1 as const

export function standardize<S extends Schema<any>>(
  config: Omit<S, keyof StandardSchemaV1>,
): S {
  return Object.assign(config as any, {
    '~standard': {
      vendor,
      version,
      validate: config.parse,
    },
  })
}

/**
 * @category Schema Definition
 * @see {@link TypeOf}
 */
export interface Schema<T> extends StandardSchemaV1<T> {
  readonly name: string
  readonly refinements?: Refinement[]
  /**
   * @category Parsing
   * @see {@link ParseResult}
   */
  readonly parse: (input: unknown, context?: ParseContext) => ParseResult<T>
}

/**
 * @category Schema Definition
 * @see {@link Schema}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const schema = x.object({ name: x.string })
 * x.TypeOf<typeof schema> // { name: string }
 * ```
 */
export type TypeOfSchema<T> = T extends Schema<infer U> ? U : never

/**
 * @category Modifier
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * const mapToUppercase = x.map((value: string) => value.toUpperCase())
 * const upperString = mapToUppercase(x.string)
 * upperString.parse('a') // { success: true, value: 'A' }
 *
 * import pipe from 'just-pipe'
 *
 * const schema = pipe(
 *   x.object({ name: upperString }),
 *   x.map((data) => ({ _tag: 'Person' as const, ...data })),
 * )
 * schema.parse({ name: 'Jack' })
 * // { success: true, value: { _tag: 'Person', name: 'JACK' } }
 * ```
 */
// export function map<S extends Schema<unknown>, Output>(
//   mapper: (input: TypeOfSchema<S>) => Output,
//   name?: string,
// ): (schema: S) => MappedSchema<S, Output>
// export function map<Input, Output>(
//   mapper: (input: Input) => Output,
//   name?: string,
// ): <S extends Schema<Input>>(schema: S) => MappedSchema<S, Output>
export function map<Input, Output>(
  mapper: (input: Input) => Output,
  name?: string,
  mapFailure: (failure: Failure) => ParseResult<Output> = (failure) => failure,
) {
  return flatMap<Input, Output>(
    (value) => ({ success: true, value: mapper(value) }),
    name,
    mapFailure,
  )
}

// type MappedSchema<S extends Schema<any>, Output> = Omit<S, 'parse'> & {
//   parse: (
//     input: InputOfSchema<S>,
//     context?: ParseContext,
//   ) => ParseResult<Output>
// }

/**
 * @category Advanced Usage / Core
 * @example
 * ```ts
 * import { x } from 'unhoax'
 * import pipe from 'just-pipe' // or elsewhere
 *
 * const numberFromString = pipe(
 *   x.string,
 *   x.map(Number),
 *   x.flatMap(x.number.parse),
 * )
 * ```
 * @example not using pipe
 * ```ts
 * import { x } from 'unhoax'
 *
 * const mapNumberFromString = x.flatMap((value: string) => x.number.parse(Number(value)))
 * const numberFromString = mapNumberFromString(string)
 *
 * numberFromString.parse('12') // { success: true, value: 12 }
 * ```
 */
// export function flatMap<S extends Schema<any>, Output>(
//   mapper: (
//     input: InputOfSchema<S>,
//     context: ParseContext,
//   ) => ParseResult<Output>,
//   name?: string,
// ): (schema: S) => MappedSchema<S, Output>
// export function flatMap<Input, Output>(
//   mapper: (input: Input, context: ParseContext) => ParseResult<Output>,
//   name?: string,
// ): <S extends Schema<Input>>(schema: S) => MappedSchema<S, Output>
export function flatMap<Input, Output>(
  mapper: (input: Input, context: ParseContext) => ParseResult<Output>,
  name?: string,
  mapFailure: (
    failure: Failure,
    context: ParseContext,
  ) => ParseResult<Output> = (failure) => failure,
) {
  return function flatMapSchema(schema: Schema<Input>): Schema<Output> {
    const schemaName = name ?? schema.name
    return {
      ...schema,
      name: schemaName,
      parse: (input: any, context = createParseContext(schemaName, input)) => {
        const result = schema.parse(input, context)
        return result.success
          ? mapper(result.value, context)
          : mapFailure(result, context)
      },
    } as any
  }
}

// export function compose<A, B>(target: Schema<B, A>) {
//   return <Input>(schema: Schema<A, Input>): Schema<B, Input> => {
//     const name = `${schema.name} |> ${target.name}`
//     return {
//       name,
//       refinements: [
//         ...(schema.refinements ?? []),
//         ...(target.refinements ?? []),
//       ],
//       parse: (input, context = createParseContext(name, input)) => {
//         const result = schema.parse(input, context)
//         return result.success ? target.parse(result.value, context) : result
//       },
//     }
//   }
// }
