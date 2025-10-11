type UnionToIntersection<Union> =
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    Union extends unknown
      ? // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        (distributedUnion: Union) => void
      : // This won't happen.
        never
  ) extends // Infer the `Intersection` type since TypeScript represents the positional
  // arguments of unions of functions as an intersection of the union.
  (mergedIntersection: infer Intersection) => void
    ? // The `& Union` is to allow indexing by the resulting type
      Intersection & Union
    : never

export type IsUnion<T> = [UnionToIntersection<T>] extends [never] ? true : false

export type FirstOf<Values extends any[], Acc = never> = [Acc] extends [never]
  ? Values extends [infer First, ...infer Rest]
    ? FirstOf<Rest, First>
    : Acc
  : Acc
// type TestFirstOf = FirstOf<[
//   never,
//   string,
//   never,
//   number,
//   symbol,
// ]>

export type IsPrimitive<Primitive, T> = [T] extends [NonNullable<T>]
  ? [T & Primitive] extends [Primitive & NonNullable<T>]
    ? [Extract<T, Primitive>] extends [never]
      ? false
      : true
    : false
  : false

// type Email = string & { tag: 'Email' }
// type aaa = IsPrimitive<Email, string>
// type bbb = Extract<string, Date>

// type Email = string & { tag: 'Email' }
// type Uuid = string & { tag: 'Uuid' }
// type Test = IsLiteral<keyof Record<'a' | 'b', string>>

type IfNever<T, Then, Else> = [T] extends [never] ? Then : Else
type IfAny<T, Then, Else> = 0 extends 1 & NoInfer<T> ? Then : Else
export type IsTuple<Arr extends any[]> = IfAny<
  Arr,
  boolean,
  IfNever<
    Arr,
    false,
    Arr extends unknown // For distributing `TArray`
      ? number extends Arr['length']
        ? false
        : true
      : false
  >
>
