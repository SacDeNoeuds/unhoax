// import type { IsLiteral } from 'type-fest'
// import type { ArraySchema } from './array'
// import type { BigIntSchema } from './bigint'
// import type { DateSchema } from './date'
// import type { MapSchema } from './Map'
// import type { NumberSchema } from './number'
// import type { ObjectSchema } from './object'
// import type { RecordSchema } from './record'
// import type { BaseSchema } from './Schema'
// import type { SetSchema } from './Set'
// import type { StringSchema } from './string'
// import type { TupleSchema } from './tuple'
// import type { FirstOf, IsPrimitive, IsTuple, IsUnion } from './types'

// export type Schema<T, Input = T> = FirstOf<
//   [
//     UnknownSchemaOrNever<T, Input>,
//     UnionSchemaOrNever<T, Input>,
//     TupleSchemaOrNever<T, Input>,
//     ArraySchemaOrNever<T, Input>,
//     SetSchemaOrNever<T, Input>,
//     MapSchemaOrNever<T, Input>,
//     ClassSchemaOrNever<T, Input>,
//     StringSchemaOrNever<T, Input>,
//     NumberSchemaOrNever<T, Input>,
//     BigIntSchemaOrNever<T, Input>,
//     DateSchemaOrNever<T, Input>,
//     BrandedSchemaOrNever<T, Input>,
//     ObjectOrRecordSchemaOrNever<T, Input>,
//     BaseSchema<T, Input>,
//   ]
// >

// type UnknownSchemaOrNever<T, Input> = [unknown] extends [T]
//   ? BaseSchema<unknown, Input>
//   : never

// type UnionSchemaOrNever<T, Input> =
//   IsUnion<T> extends true // literal or union, no way of knowing reliably.
//     ? BaseSchema<T, Input>
//     : never

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

// // Tests
// // type TestUnknown = Schema<unknown, unknown>
// // type TestUnionOfLiterals = Schema<'a' | 'b', unknown>
// // type TestUnionOfObjects = Schema<
// //   { type: 'a'; a: string } | { type: 'b'; b: number },
// //   unknown
// // >
// // type TestTuple = Schema<[string, number], unknown>
// // type TestArray = Schema<number[], unknown>
// // type TestSet = Schema<Set<number>, unknown>
// // type TestMap = Schema<Map<string, number>, unknown>
// // class Toto {}
// // type TestClass = Schema<typeof Toto, unknown>
// // type TestString = Schema<string, string>
// // type TestNumber = Schema<number, number>
// // type TestBigInt = Schema<bigint, bigint>
// // type TestDate = Schema<Date, Date>
// // type TestRecord = Schema<Record<string, number>, never>
// // type TestObject1 = Schema<{ a: number }, never>
// // type TestObject2 = Schema<{ a: number; b: string }, never>

// // type Year = number & { type: 'Year' }
// // type Email = string & { type: 'Email' }

// // type TestRecordWithBrandedNumberKey = Schema<Record<Year, number>, never>
// // type TestRecordWithBrandedStringKey = Schema<Record<Email, number>, never>
// // type TestBrandedNumber = Schema<Year, string>
// // type TestBrandedString = Schema<Email, string>
