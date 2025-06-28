# Why yet-another schema library?

**TL;DR:** Safety-first and terrible types.

## Safety first

unhoax provides default **size guards** everywhere, to diminish the risk of **Denial of Service attacks**, **resource exhaustion** and **oversized payload**.

```ts
import { x } from 'unhoax'

x.array.defaultMaxSize // 100
x.setOf.defaultMaxSize // 100
x.mapOf.defaultMaxSize // 100
x.string.defaultMaxSize // 100_000

// You can define your own guards:
x.array.defaultMaxSize = 10_000
// every array schema with no specific max size
// will now have a maximum of 10,000 items.

// The rules are retro-active:
const mySchema = x.array(x.number)

x.array.defaultMaxSize = 3
mySchema.parse([1, 2, 3, 4]).success === false
```

You can deactivate those guards by providing the value `Infinity`:

```ts
x.array.defaultMaxSize = Infinity
```

## Terrible types

Most of the libraries out there have terrible typings.

They all force _you_ to adapt your types to _them_. A good library should integrate with you, not force you to do things for them, getting the best of all worlds.

This ends up making TypeScript intellisense and errors completely unreadable.

It doesn't have to be that way.

```ts
import { z } from 'zod'

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
})

type User = z.infer<typeof userSchema>
declare const getUser: (value: User) => void
// Hovering on `value` gives:
// (parameter) value: {
//     id: number;
//     name: string;
// }
```

For 2 properties it is still fine, but for more, it quickly goes out of hand.

A great way of ensuring proper names for types in TypeScript is to use interfaces:

```ts
interface User {
  id: number
  name: string
}

const userSchema = x.object<User>({ … }) // x.ObjectSchema<User>, a simple type!

declare const getUser: (value: User) => void
// Hovering on `value` gives:
// (parameter) value: User
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

Now imagine reading an error containing that type… where do you start?

Plus, I usually already have my type and want to use it to get proper names, which I can’t:

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

This applies for `effect`, `decoders`, `@arrirpc/schema`, etc…

When working on a production application, it means I have no choice but having doomed unreadable types. Needless to say it does not help my daily life.

The only nice library I have seen regarding the type system is [ts.data.json](https://github.com/joanllenas/ts.data.json). `unhoax` brings the same goodies and a lot more utilities and safety-by-default for the same bundle size (~5kB).

## What about ArkType, ReScript Schema & co?

They _compile_ schemas instead of parsing at runtime. Which tends to delegate bundle size on you instead of the library and **requires** a compile step, while JavaScript is an interpreted language.

NodeJS now supports natively TypeScript by _stripping type annotations_ (transpiling), not _compiling the code_. Transpiling is in general a common practice, so I'd rather avoid making a compile step necessary.

Use those if you _absolutely **need**_ a lightning-fast super-quick library because your environment has some response time specificities. I would redirect you to the [runtime benchmarks](https://moltar.github.io/typescript-runtime-type-benchmarks/) to pick your best option, and get prepared to facade to interchange it as soon as a faster lib comes out.

In other cases, libraries can leverage unsafe APIs like [`new Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function) or [`eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) to compile schemas.

> **MDN excerpts**
>
> 1. The `Function()` constructor creates Function objects. Calling the constructor directly can create functions dynamically, but suffers from security and similar (but far less significant) performance issues as `eval()`.
> 2. Executing JavaScript from a string is an enormous security risk. It is far too easy for a bad actor to run arbitrary code when you use `eval()`. See Never use direct `eval()`!, below.
