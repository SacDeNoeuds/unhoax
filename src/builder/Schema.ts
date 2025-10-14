import type { SchemaLike } from './SchemaFactory'
import type { SchemaRefiners } from './SchemaRefiners'

export type InputOf<S> = S extends SchemaLike<any, infer Input> ? Input : never
export type TypeOf<S> = S extends SchemaLike<infer Output, any> ? Output : never

type Params = {
  input: any
  output: any
  meta?: SchemaMetaShape
}

export interface Schema<P extends Params>
  extends SchemaLike<P['output'], P['input']>,
    SchemaRefiners<P['output'], P['input']>,
    SchemaMeta<P['meta']> {}

type PermittedAdditionalProps =
  | 'item' // for iterable schemas
  | 'items' // for tuple schemas
  | 'props' // for object schemas
  | 'key' // for record schemas
  | 'value' // for record schemas
  | 'defaultMaxSize' // for sized schemas
  | 'schemas' // for … unions
  | 'literals' // for … literals

export type SchemaMetaShape = Partial<Record<PermittedAdditionalProps, any>>

export interface SchemaMeta<M extends SchemaMetaShape | undefined> {
  item: Prop<M, 'item'> // for iterable schemas
  items: Prop<M, 'items'> // for tuple schemas
  props: Prop<M, 'props'> // for object schemas
  key: Prop<M, 'key'> // for record schemas
  value: Prop<M, 'value'> // for record schemas
  defaultMaxSize: Prop<M, 'defaultMaxSize'> // for sized schemas
  schemas: Prop<M, 'schemas'> // for unions
  literals: Prop<M, 'literals'> // for literals
}

export type SchemaMetaOf<S> = Pick<
  Extract<S, SchemaMetaShape>,
  PermittedAdditionalProps
>

type Prop<Props, Prop extends keyof NonNullable<Props>> = [Props] extends [
  undefined,
]
  ? undefined
  : [unknown] extends [NonNullable<Props>[Prop]]
    ? undefined
    : NonNullable<Props>[Prop]

// Used only in object, as of now.
// export type ProbableSchemaOf<T> = FirstOf<
//   [
//     UnknownSchemaOrNever<T>,
//     LiteralsSchemaOrNever<T>,
//     UnionSchemaOrNever<T>,
//     TupleSchemaOrNever<T>,
//     ArraySchemaOrNever<T>,
//     SetSchemaOrNever<T>,
//     MapSchemaOrNever<T>,
//     ClassSchemaOrNever<T>,
//     StringSchemaOrNever<T>,
//     NumberSchemaOrNever<T>,
//     BigIntSchemaOrNever<T>,
//     DateSchemaOrNever<T>,
//     BrandedSchemaOrNever<T>,
//     ObjectOrRecordSchemaOrNever<T>,
//     Schema<{ input: T; output: T }>,
//   ]
// >

// type UnknownSchemaOrNever<T> = [unknown] extends [T] ? UnknownSchema : never

// type LiteralsSchemaOrNever<T> =
//   IsUnion<T> extends true
//     ? [T] extends [Literal]
//       ? LiteralSchema<T[]>
//       : never
//     : never

// type UnionSchemaOrNever<T> =
//   IsUnion<T> extends true // literal or union, no way of knowing reliably.
//     ? Schema<{ input: T; output: T }>
//     : never

// type TupleSchemaOrNever<T> =
//   IsTuple<T & any[]> extends true
//     ? // @ts-ignore
//       TupleSchema<{
//         [Key in keyof T]: ProbableSchemaOf<T[Key]>
//       }>
//     : never

// type ArraySchemaOrNever<T> = T extends (infer U)[]
//   ? ArraySchema<ProbableSchemaOf<U>>
//   : never

// type SetSchemaOrNever<T> =
//   T extends Set<infer U> ? SetSchema<ProbableSchemaOf<U>> : never

// type MapSchemaOrNever<T> =
//   T extends Map<infer Key, infer Value>
//     ? MapSchema<ProbableSchemaOf<Key>, ProbableSchemaOf<Value>>
//     : never

// type ClassSchemaOrNever<T> = T extends new (...args: any[]) => infer U
//   ? Schema<{ input: U; output: U }>
//   : never

// type StringSchemaOrNever<T> =
//   IsPrimitive<string, T> extends true ? StringSchema : never

// type NumberSchemaOrNever<T> =
//   IsPrimitive<number, T> extends true ? NumberSchema : never

// type BigIntSchemaOrNever<T> =
//   IsPrimitive<bigint, T> extends true ? BigIntSchema : never

// type DateSchemaOrNever<T> =
//   IsPrimitive<Date, T> extends true ? DateSchema : never

// type Primitive = string | number | Date | boolean | symbol
// type BrandedSchemaOrNever<T> = T extends Primitive & Record<string, any>
//   ? // FIXME: extract primitive type…
//     Schema<{ input: T; output: T }>
//   : never

// type ObjectOrRecordSchemaOrNever<T> =
//   T extends Record<infer Key, infer Value>
//     ? [IsLiteral<Key>] extends [true]
//       ? ObjectSchema<T>
//       : // @ts-ignore FIXME
//         RecordSchema<ProbableSchemaOf<Key>, ProbableSchemaOf<Value>>
//     : never

// // Tests
// type TestUnknown = ProbableSchemaOf<unknown>
// type TestUnionOfLiterals = ProbableSchemaOf<'a' | 'b'>
// type TestUnionOfObjects = ProbableSchemaOf<
//   { type: 'a'; a: string } | { type: 'b'; b: number }
// >
// type TestTuple = ProbableSchemaOf<[string, number]>
// type TestArray = ProbableSchemaOf<number[]>
// type TestSet = ProbableSchemaOf<Set<number>>
// type TestMap = ProbableSchemaOf<Map<string, number>>
// class Toto {}
// type TestClass = ProbableSchemaOf<typeof Toto>
// type TestString = ProbableSchemaOf<string>
// type TestNumber = ProbableSchemaOf<number>
// type TestBigInt = ProbableSchemaOf<bigint>
// type TestDate = ProbableSchemaOf<Date>
// type TestRecord = ProbableSchemaOf<Record<string, number>>
// type TestObject1 = ProbableSchemaOf<{ a: number }>
// type TestObject2 = ProbableSchemaOf<{ a: number; b: string }>

// type Year = number & { type: 'Year' }
// type Email = string & { type: 'Email' }

// type TestRecordWithBrandedNumberKey = ProbableSchemaOf<Record<Year, number>>
// type TestRecordWithBrandedStringKey = ProbableSchemaOf<Record<Email, number>>
// type TestBrandedNumber = ProbableSchemaOf<Year>
// type TestBrandedString = ProbableSchemaOf<Email>
