# Why yet-another schema library?

Because all the libraries out there have a terrible type mindset.

They all force _you_ to adapt your types to _them_. A good library should integrate with you, not force you to do things for them, getting the best of all worlds.

This ends in making TypeScript intellisense and errors completely unreadable. It doesn't have to be that way.

## Types with terrible names

A great way of ensuring proper names for types in TypeScript is to use interfaces:

```ts
import { z } from 'zod'

const userSchema1 = z.object({
  id: z.number(),
  name: z.string(),
})

type User1 = z.infer<typeof userSchema1>
declare const getUser1: (value: User1) => void
// Hovering on `value` gives:
// (parameter) value: {
//     id: number;
//     name: string;
// }
// For 2 properties it is still fine, but for more…

interface User2 {
  id: number
  name: string
}

const userSchema2 = x.object<User2>({ … }) // x.ObjectSchema<User2>, a simple type!

declare const getUser2: (value: User2) => void
// Hovering on `value` gives:
// (parameter) value: User2
```

## Another zod example

```ts
const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  prop1: z.string(),
  // …
  prop9: z.string(),
})

// When I hover, here is the type I get:
// I haven't even started anything, the type has already become unreadable.
const userSchema: z.ZodObject<{
    id: z.ZodNumber;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    prop1: z.ZodString;
    prop2: z.ZodString;
    prop3: z.ZodString;
    prop4: z.ZodString;
    ... 4 more ...;
    prop9: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ...;
}, {
    ...;
}>
```

If I already have my type and want to use it to get proper names, I can’t:

```ts
interface User { … }

const userSchema = z.object<User>({ … })
// fails -> Type `User` does not satisfy the constraint `ZodRawShape`
```

## A valibot example

```ts
const userSchema = v.object({
  id: v.number(),
  name: v.string(),
})

// hovering on `userSchema` gives:
const userSchema: v.ObjectSchema<
  {
    readonly id: v.NumberSchema<undefined>
    readonly name: v.StringSchema<undefined>
  },
  undefined
>
// With 2 properties it is fine, but I will have more.
// And I haven't even transformed the output yet (those who know… they know).

interface User { … }

// If I try to give it an interface
// It fails -> Type `User` does not satisfy the constraint `ObjectEntries`
const userSchema = v.object<User>({ … })
```

## … and so on

This applies for Effect, decoders, @arrirpc/schema, etc…

When working on a production application, it means I have no choice but having doomed unreadable types. Needless to say it does not help my daily life.

The only nice library I have seen regarding the type system is [ts.data.json](https://github.com/joanllenas/ts.data.json). `unhoax` brings the same goodies and a lot more utilities and safety-by-default for the same bundle size (~5kB).

## What about ArkType, rescript schema & co?

They _compile_ schemas instead of parsing at runtime. Which tends to delegate bundle size on you instead of the library and **requires** a compile step, while JavaScript is an interpreted language.

Node now supports natively TypeScript by _stripping type annotations_, not _compiling the code_. So I'd rather avoid making a compile step necessary.

Use those if you _absolutely **need**_ a lightning-fast super-quick library because your environment has some response time specificities. I would redirect you to the [runtime benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/) to pick your best option, and get prepared to facade to interchange it as soon as a faster lib comes out.

In other cases, libraries can leverage unsafe APIs like [`new Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function) or [`eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) to compile schemas.

> **MDN excerpts**
>
> 1. The `Function()` constructor creates Function objects. Calling the constructor directly can create functions dynamically, but suffers from security and similar (but far less significant) performance issues as `eval()`.
> 2. Executing JavaScript from a string is an enormous security risk. It is far too easy for a bad actor to run arbitrary code when you use `eval()`. See Never use direct `eval()`!, below.
