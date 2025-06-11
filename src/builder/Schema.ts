import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ParseContext } from '../common/ParseContext'
import type { ParseResult } from '../common/ParseResult'
import type { Refinement, SchemaMeta } from '../common/Schema'
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

export type Schema<T> = [unknown] extends [T]
  ? BaseSchema<unknown>
  : IsUnion<T> extends true // literal or union, no way of knowing reliably.
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
            : string extends T
              ? StringSchema
              : number extends T
                ? NumberSchema
                : Date extends T
                  ? DateSchema
                  : bigint extends T
                    ? BigIntSchema
                    : [T] extends [Record<string, any>]
                      ? T extends string | number | Date | bigint | boolean
                        ? BaseSchema<T> // avoid to type branded type as ObjectSchema
                        : IsUnion<keyof T> extends true
                          ? ObjectSchema<T>
                          : RecordSchema<keyof T, T[keyof T]>
                      : BaseSchema<T>

export interface SchemaConfig<T> {
  readonly name: string
  readonly parser: (
    input: unknown,
    context: ParseContext,
    self: any,
  ) => ParseResult<T>
  readonly meta?: SchemaMeta
  readonly refinements?: Record<string, Refinement<T>>
}

export interface SchemaLike<T> {
  readonly name: string
  parse(input: unknown, context?: ParseContext): ParseResult<T>
}

/**
 * This interface contains all the global utilities of any schema.
 *
 * @category Reference
 */
export interface BaseSchema<T> extends SchemaConfig<T>, BaseBuilder<T> {}

export interface BaseBuilder<T> extends StandardSchemaV1<unknown, T> {
  parse(input: unknown, context?: ParseContext): ParseResult<T>
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
    refine: (value: T) => boolean,
    config?: Omit<Refinement<T>, 'refine'>,
  ): Schema<T>
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
  guardAs<U extends T>(
    name: string,
    refine: (value: T) => value is U,
    config?: Omit<Refinement<T>, 'refine'>,
  ): Schema<U>
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
  map<U>(mapper: (value: T) => U): Schema<U>
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
    schema: BaseSchema<U>,
    coerce: (input: T) => U,
  ): Schema<U>
  /**
   * @category Reference
   * @example
   * ```ts
   * const schema = x.string.recover(() => 42)
   * assert(schema.parse('hey').value === 'hey')
   * assert(schema.parse(true).value === 42)
   * ```
   */
  recover<U>(getFallback: () => U): Schema<T | U>
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
  optional<U = undefined>(defaultValue?: U): Schema<T | U>
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
  nullable<U = null>(defaultValue?: U): Schema<T | U>
}
