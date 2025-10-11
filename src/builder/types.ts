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
