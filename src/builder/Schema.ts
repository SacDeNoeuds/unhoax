import type { StandardSchemaV1 } from '@standard-schema/spec'
import { type ParseContext } from '../ParseContext'
import { type ParseResult } from '../ParseResult'
import type { ArraySchema } from './array'
import type { BigIntSchema } from './bigint'
import type { DateSchema } from './date'
import type { MapSchema } from './Map'
import type { NumberSchema } from './number'
import type { ObjectSchema } from './object'
import type { RecordSchema } from './record'
import type { SetSchema } from './Set'
import type { StringSchema } from './string'
import type { TupleSchema } from './tuple'
import type { IsTuple, IsUnion } from './types'

export type TypeOfSchema<T> = T extends {
  parse: (...args: any[]) => ParseResult<infer U>
}
  ? U
  : never

export type Schema<T> =
  IsUnion<T> extends true // literal or union, no way of knowing reliably.
    ? BaseSchema<T>
    : T extends any[]
      ? IsTuple<T> extends true
        ? TupleSchema<T>
        : ArraySchema<T[number]>
      : T extends Set<infer U>
        ? SetSchema<U>
        : T extends Map<infer Key, infer Value>
          ? MapSchema<Key, Value>
          : T extends new (...args: any[]) => infer U
            ? BaseSchema<U>
            : [T] extends [string]
              ? StringSchema
              : [T] extends [number]
                ? NumberSchema
                : [T] extends [Date]
                  ? DateSchema
                  : [T] extends [bigint]
                    ? BigIntSchema
                    : T extends Record<string, any>
                      ? IsUnion<keyof T> extends true
                        ? ObjectSchema<T>
                        : RecordSchema<keyof T, T[keyof T]>
                      : BaseSchema<T>

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

/**
 * This interface contains all the global utilities of any schema.
 *
 * @category Schema
 */
export interface BaseSchema<T> extends SchemaConfig<T>, BaseBuilder<T> {}

export type SchemaMeta = Record<string, Record<string, unknown>>
export interface Refinement<T> {
  refine: (value: T, config: Omit<Refinement<T>, 'refine'>) => boolean
  [Key: string]: unknown
}

export interface BaseBuilder<T> extends StandardSchemaV1<unknown, T> {
  parse(input: unknown, context?: ParseContext): ParseResult<T>
  /**
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
    refine: (value: T) => boolean,
    config?: Omit<Refinement<T>, 'refine'>,
  ): Schema<T>
  /**
   * @example
   * ```ts
   * import { capitalize } from './test-utils'
   *
   * const capitalized = x.string.map(capitalize)
   * assert(capitalized.parse('hey').value === 'Hey')
   * ```
   */
  map<U>(mapper: (value: T) => U): Schema<U>
  /**
   * @example
   * ```ts
   * import { capitalize } from './test-utils'
   *
   * const capitalized = x.string.map('Capitalized', capitalize)
   * assert(capitalized.parse('hey').value === 'Hey')
   * assert(capitalized.name === 'Capitalized')
   * ```
   */
  map<U>(name: string, mapper: (value: T) => U): Schema<U>
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
   */
  convertTo<U>(schema: BaseSchema<U>, coerce: (input: T) => U): Schema<U>
  /**
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
    schema: BaseSchema<U>,
    coerce: (input: T) => U,
  ): Schema<U>
  /**
   * @example
   * ```ts
   * const schema = x.string.recover(() => 42)
   * assert(schema.parse('hey').value === 'hey')
   * assert(schema.parse(true).value === 42)
   * ```
   */
  recover<U>(getFallback: () => U): Schema<T | U>
  /**
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
  optional<U = undefined>(defaultValue?: U): Schema<T | U>
  /**
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
  nullable<U = null>(defaultValue?: U): Schema<T | U>
}
