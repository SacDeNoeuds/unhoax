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

// type Test01 = IsUnion<string>
// type Test02 = IsUnion<string | number>
// type Test03 = IsUnion<'a' | 'b'>

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

// type Test01 = IsTuple<any[]>
// type Test02 = IsTuple<number[]>
// type Test03 = IsTuple<[number]>
// type Test04 = IsTuple<[number, ...number[]]>
// type Test05 = IsTuple<[number, number, number, number]>
