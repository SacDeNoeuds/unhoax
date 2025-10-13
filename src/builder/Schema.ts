import type { SchemaLike } from './SchemaFactory'
import type { SchemaRefiners } from './SchemaRefiners'
import type { FirstOf, IsUnion } from './types'

export type InputOf<S> = S extends SchemaLike<any, infer Input> ? Input : never
export type TypeOf<S> = S extends SchemaLike<infer Output, any> ? Output : never

type Params = {
  input: any
  output: any
  props?: SchemaAdditionalProps
}

export interface Schema<P extends Params>
  extends SchemaLike<P['output'], P['input']>,
    SchemaRefiners<P['output'], P['input']>,
    SchemaProps<P['props']> {}

type PermittedAdditionalProps =
  | 'item' // for iterable schemas
  | 'items' // for tuple schemas
  | 'props' // for object schemas
  | 'key' // for record schemas
  | 'value' // for record schemas
  | 'defaultMaxSize' // for sized schemas
  | 'schemas' // for … unions
  | 'literals' // for … literals

export type SchemaAdditionalProps = Partial<
  Record<PermittedAdditionalProps, any>
>

export interface SchemaProps<P extends SchemaAdditionalProps | undefined> {
  item: Prop<P, 'item'> // for iterable schemas
  items: Prop<P, 'items'> // for tuple schemas
  props: Prop<P, 'props'> // for object schemas
  key: Prop<P, 'key'> // for record schemas
  value: Prop<P, 'value'> // for record schemas
  defaultMaxSize: Prop<P, 'defaultMaxSize'> // for sized schemas
  schemas: Prop<P, 'schemas'> // for unions
  literals: Prop<P, 'literals'> // for literals
}

export type SchemaPropsOf<S> = Pick<
  Extract<S, SchemaAdditionalProps>,
  PermittedAdditionalProps
>

export type SchemaOf<P extends Params> = FirstOf<
  [
    UnknownSchemaOrNever<P>,
    UnionSchemaOrNever<P>,
    // TupleSchemaOrNever<T, Input>,
    // ArraySchemaOrNever<T, Input>,
    // SetSchemaOrNever<T, Input>,
    // MapSchemaOrNever<T, Input>,
    // ClassSchemaOrNever<T, Input>,
    // StringSchemaOrNever<T, Input>,
    // NumberSchemaOrNever<T, Input>,
    // BigIntSchemaOrNever<T, Input>,
    // DateSchemaOrNever<T, Input>,
    // BrandedSchemaOrNever<T, Input>,
    // ObjectOrRecordSchemaOrNever<T, Input>,
    Schema<P>,
  ]
>

type Prop<Props, Prop extends keyof NonNullable<Props>> = [Props] extends [
  undefined,
]
  ? undefined
  : [unknown] extends [NonNullable<Props>[Prop]]
    ? undefined
    : NonNullable<Props>[Prop]

type UnknownSchemaOrNever<P extends Params> = [unknown] extends [P['output']]
  ? Schema<P>
  : never

type UnionSchemaOrNever<P extends Params> =
  IsUnion<P['output']> extends true // literal or union, no way of knowing reliably.
    ? Schema<P>
    : never

// type TupleSchemaOrNever<T, Input> =
//   IsTuple<T & any[]> extends true ? TupleSchema<T, Input> : never

// type ArraySchemaOrNever<T, Input> = T extends (infer U)[]
//   ? ArraySchema<U, Input>
//   : never

// type SetSchemaOrNever<T, Input> =
//   T extends Set<infer U> ? SetSchema<U, Input> : never

// type MapSchemaOrNever<T, Input> =
//   T extends Map<infer Key, infer Value> ? MapSchema<Key, Value, Input> : never

// type ClassSchemaOrNever<T, Input> = T extends new (...args: any[]) => infer U
//   ? BaseSchema<U, Input>
//   : never

// type StringSchemaOrNever<T, Input> =
//   IsPrimitive<string, T> extends true ? StringSchema<Input> : never

// type NumberSchemaOrNever<T, Input> =
//   IsPrimitive<number, T> extends true ? NumberSchema<Input> : never

// type BigIntSchemaOrNever<T, Input> =
//   IsPrimitive<bigint, T> extends true ? BigIntSchema<Input> : never

// type DateSchemaOrNever<T, Input> =
//   IsPrimitive<Date, T> extends true ? DateSchema<Input> : never

// type Primitive = string | number | Date | boolean | symbol
// type BrandedSchemaOrNever<T, Input> = T extends Primitive & Record<string, any>
//   ? BaseSchema<T, Input>
//   : never

// type ObjectOrRecordSchemaOrNever<T, Input> =
//   T extends Record<string, any>
//     ? [IsLiteral<keyof T>] extends [true]
//       ? ObjectSchema<T, Input>
//       : RecordSchema<keyof T, T[keyof T], Input>
//     : never

// Tests
// type TestUnknown = Schema<{ input: unknown; output: unknown }>
// type TestUnionOfLiterals = Schema<{ output: 'a' | 'b'; input: unknown }>
// type TestUnionOfObjects = Schema<
//   { type: 'a'; a: string } | { type: 'b'; b: number },
//   unknown
// >
// type TestTuple = Schema<[string, number], unknown>
// type TestArray = Schema<number[], unknown>
// type TestSet = Schema<Set<number>, unknown>
// type TestMap = Schema<Map<string, number>, unknown>
// class Toto {}
// type TestClass = Schema<typeof Toto, unknown>
// type TestString = Schema<string, string>
// type TestNumber = Schema<number, number>
// type TestBigInt = Schema<bigint, bigint>
// type TestDate = Schema<Date, Date>
// type TestRecord = Schema<Record<string, number>, never>
// type TestObject1 = Schema<{ a: number }, never>
// type TestObject2 = Schema<{ a: number; b: string }, never>

// type Year = number & { type: 'Year' }
// type Email = string & { type: 'Email' }

// type TestRecordWithBrandedNumberKey = Schema<Record<Year, number>, never>
// type TestRecordWithBrandedStringKey = Schema<Record<Email, number>, never>
// type TestBrandedNumber = Schema<Year, string>
// type TestBrandedString = Schema<Email, string>
