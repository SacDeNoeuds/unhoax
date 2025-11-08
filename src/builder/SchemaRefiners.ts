import type { Refinement } from '../common/Schema'
import type { Schema, SchemaMetaOf } from './Schema'
import type { SchemaLike } from './SchemaFactory'

/**
 * All the utilities to transform, bend or map unhoax schemas.
 */
export interface SchemaRefiners<Output> {
  /**
   * @category Reference
   * @example
   * ```ts
   * import { isCapitalized } from './test-utils'
   *
   * const capitalized = x.string.refine('capitalized', isCapitalized)
   * assert(capitalized.parse('hey').success === false)
   * assert(capitalized.parse('Hey').success === true)
   * ```
   */
  refine(
    name: string,
    refine: (value: Output) => boolean,
    config?: Omit<Refinement<Output>, 'refine'>,
  ): this

  /**
   * @category Reference
   * @example
   * ```ts
   * type Email = string & { _tag: 'Email' }
   * const isEmail = (s: string): s is Email => s.includes('@')
   *
   * const schema = x.string.guardAs('Email', isEmail)
   * assert(schema.parse('hey').success === false)
   * assert(schema.parse('hey@yo').success === true)
   * ```
   */
  guardAs<U extends Output>(
    name: string,
    refine: (value: Output) => value is U,
    config?: Omit<Refinement<Output>, 'refine'>,
  ): Evolve<this, U>

  /**
   * @category Reference
   * @example
   * ```ts
   * import { capitalize } from './test-utils'
   *
   * const capitalized = x.string.map(capitalize)
   * assert(capitalized.parse('hey').value === 'Hey')
   * ```
   */
  map<U>(mapper: (value: Output) => U): Evolve<this, U>
  /**
   * @category Reference
   * @example
   * ```ts
   * import { capitalize } from './test-utils'
   *
   * const capitalized = x.string.map('Capitalized', capitalize)
   * assert(capitalized.parse('hey').value === 'Hey')
   * assert(capitalized.name === 'Capitalized')
   * ```
   */
  map<U>(name: string, mapper: (value: Output) => U): Evolve<this, U>

  /**
   * @example
   * ```ts
   * const numberFromString = x.string.convertTo(x.number, Number)
   * assert(numberFromString.parse('42').value === 42)
   * assert(numberFromString.parse('toto').success === false)
   * assert(numberFromString.parse(42).success === false) // input needs to be a string first, then coerced as a number
   *
   * assert(numberFromString.name === 'number')
   * ```
   * @example it returns a failure when the coercer throws
   * ```ts
   * class FakeTemporalPlainDate {
   *   static from(input: string): FakeTemporalPlainDate {
   *     throw new Error("invalid plain date")
   *   }
   * }
   * const plainDateSchema = x.string.convertTo(
   *   x.instanceOf(FakeTemporalPlainDate),
   *   FakeTemporalPlainDate.from
   * )
   * assert(plainDateSchema.parse('42').success === false)
   * ```
   */
  convertTo<U>(
    schema: SchemaLike<U, any>,
    coerce: (input: Output) => U,
  ): Evolve<this, U>
  /**
   * @category Reference
   * @example provide a name to the generated schema:
   * ```ts
   * const numberFromString = x.string.convertTo(
   *   'numberFromString',
   *   x.number,
   *   Number,
   * )
   *
   * assert(numberFromString.parse('42').value === 42)
   * assert(numberFromString.name === 'numberFromString')
   * ```
   */
  convertTo<U>(
    name: string,
    schema: SchemaLike<U, any>,
    coerce: (input: Output) => U,
  ): Evolve<this, U>
  /**
   * @category Reference
   * @example
   * ```ts
   * const schema = x.string.recover(() => 42)
   * assert(schema.parse('hey').value === 'hey')
   * assert(schema.parse(true).value === 42)
   * ```
   */
  recover<U>(getFallback: () => U): Evolve<this, Output | U>
  /**
   * @category Reference
   * @example
   * ```ts
   * const schema = x.string.optional()
   * assert(schema.parse(undefined).success === true)
   * assert(schema.parse(undefined).value === undefined)
   * assert(schema.parse('abc').value === 'abc')
   * ```
   * @example with default value
   * ```ts
   * const schema = x.string.optional(42)
   * assert(schema.parse(undefined).success === true)
   * assert(schema.parse(undefined).value === 42)
   * ```
   */
  optional<U = undefined>(defaultValue?: U): Evolve<this, Output | U>
  /**
   * @category Reference
   * @example
   * ```ts
   * const schema = x.string.nullable()
   * assert(schema.parse(null).success === true)
   * assert(schema.parse(null).value === null)
   * assert(schema.parse(null).value === null)
   * assert(schema.parse('abc').value === 'abc')
   * ```
   * @example with default value
   * ```ts
   * const schema = x.string.nullable(42)
   * assert.deepEqual(schema.parse(null), { success: true, value: 42 })
   * ```
   */
  nullable<U = null>(defaultValue?: U): Evolve<this, Output | U>
}

type Evolve<PreviousSchema, NextOutput> =
  PreviousSchema extends SchemaLike<infer Output, infer Input>
    ? [Output, NextOutput] extends [NextOutput, Output]
      ? PreviousSchema
      : Schema<{
          input: Input
          output: NextOutput
          meta: SchemaMetaOf<PreviousSchema>
        }>
    : never
