import { createParseContext, type ParseContext } from './ParseContext'
import { type ParseResult } from './ParseResult'
import type { Refinement } from './refine'

/**
 * @category Schema Definition
 * @see {@link TypeOf}
 */
export interface Schema<T, Input = unknown> {
  readonly name: string
  readonly refinements?: Refinement[]
  /**
   * @category Parsing
   * @see {@link ParseResult}
   */
  readonly parse: (input: Input, context?: ParseContext) => ParseResult<T>
}

/**
 * @category Schema Definition
 * @see {@link Schema}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const schema = x.object({ name: x.string })
 * x.TypeOf<typeof schema> // { name: string }
 * ```
 */
export type TypeOfSchema<T> = T extends Schema<infer U, any> ? U : never

/**
 * @category Schema Definition
 * @see {@link Schema}
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * // reminder: type Schema<T, Input = unknown> = …
 * declare const stringFromNumber = Schema<string, number>
 *
 * x.InputOf<typeof schema> // number
 * ```
 */
export type InputOfSchema<T> = T extends Schema<any, infer U> ? U : never

/**
 * @category Modifier
 * @example
 * ```ts
 * import * as x from 'unhoax'
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
) {
  return flatMap<Input, Output>(
    (value) => ({ success: true, value: mapper(value) }),
    name,
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
 * import * as x from 'unhoax'
 *
 * const mapNumberFromString = x.flatMap((value: string) => x.number.parse(Number(value)))
 * const numberFromString = mapNumberFromString(string)
 *
 * numberFromString.parse('12') // { success: true, value: 12 }
 *
 * // or, using pipe
 * import pipe from 'just-pipe'
 *
 * const numberFromString = pipe(
 *   x.string,
 *   x.map(Number),
 *   x.flatMap(x.number.parse),
 * )
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
) {
  return function flatMapSchema<I = unknown>(
    schema: Schema<Input, I>,
  ): Schema<Output, I> {
    const schemaName = name ?? schema.name
    return {
      ...schema,
      name: schemaName,
      parse: (input, context = createParseContext(schemaName, input)) => {
        const result = schema.parse(input, context)
        return result.success ? mapper(result.value, context) : result
      },
    }
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
