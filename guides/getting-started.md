---
title: 1. Getting Started
category: Guide
---

## Installing unhoax

```sh
npm install --save unhoax
```

## Basic Usage

### Simple schemas (primitives)

Let’s start with a string.

```ts
import { x } from 'unhoax'
// or
import { string } from 'unhoax'

// creating a schema for strings
const schema = x.string

// parsing – safe by default.
schema.parse('Hello, World!') // => { result: true, value: 'Hello, World!' }
schema.parse(42) // => { result: false, error: x.ParseError }

// unsafe parsing (throws if validation fails)
x.unsafeParse(schema, 'Hello, World!') // => 'Hello, World!'
x.unsafeParse(schema, 42) // => throws
```

Other simple schemas

```ts
x.number
x.integer
x.boolean
x.bigint
x.symbol
x.date
x.unknown
x.literal('a')
x.literal('a', 'b', 42, true, …)
// unsafe:
x.untrimmedString
x.unsafeNumber // accepts NaN and non-finite numbers
x.unsafeInteger // accepts anything passing `Number.isInteger`
```

### Composite schemas – like object/struct/array/Map/…

Let’s start with a simple User object:

```ts
// type-driven:
interface User {
  id: number
  name: string
  email: string
}

const userSchema = x.object<User>({
  id: x.number,
  name: x.string,
  email: x.string,
})
userSchema.parse({ … }) // { result: true, value: User } <- `User` is properly named via intellisense

// infer-driven:

const userSchema = x.object({
  id: x.number,
  name: x.string,
  email: x.string,
})
type User = x.TypeOf<typeof userSchema>

userSchema.parse({ … })
// { result: true, value: { id: number, … } } <- `User` is not properly named
```

Other composite schemas:

```ts
x.array(userSchema) // x.Schema<User[]>
x.Set(userSchema) // x.Schema<Set<User>>
x.Map(x.number, userSchema) // x.Schema<Map<number, User>>
x.Record(x.number, userSchema) // x.Schema<Record<number, User>>
x.tuple(x.number, userSchema) // x.Schema<[number, User]>

x.union(x.number, x.string) // x.Schema<number | string>

enum Toto { … }
x.Enum(Toto) // Schema<Toto>
```

## Inference

```ts
import { x } from 'unhoax'

const schema = x.object({ name: x.string })
type Test = x.TypeOf<typeof schema>
Test // { name: string }
```

## Transforming Data

```ts
import pipe from 'just-pipe'
import { x } from 'unhoax'

const objectWithNameFromString = pipe(
  x.string,
  x.map((name) => ({ name })),
) // Schema<{ name: string }>

const upperCaseString = pipe(
  x.string,
  x.map((string) => string.toUpperCase()),
)
```

## Refinements

Checkout the [reference](../modules.html) for built-in refinements.

### With predicates – `isX(value: T): boolean`

```ts
import { x } from 'unhoax'
import pipe from 'just-pipe'

declare function isEmail(value: string): boolean

const email = pipe(x.string, x.refine('Email', isEmail))
```

### With guards – `isX(value: …): value is T`

```ts
import { x } from 'unhoax'
import pipe from 'just-pipe'

declare function isEmail(value: string): value is Email

const email = pipe(x.string, x.refineAs('Email', isEmail)) // Schema<Email>
```
