---
title: 1. Getting Started
category: Guide
---

## Installing unhoax

```sh
npm install --save unhoax
```

## Foreword – Philosophy

This library is intended for use with **a functional, domain-driven & type-driven approach** to development. Writing types before anything else.<br>
Then using types to define schemas, use-cases, etc…

For a detailed explanation with examples, see [why yet-another?](./why-yet-another.md)

All the libraries are great, usually with good type inference and large API surface – thus making choices on your behalf (see the [email example](./custom-type-email.md) to see what I mean).

In general, `unhoax` proposes **less** features, and that is because we all have our development environment and there is no way for me to know about your requirements.

## Basic Usage

This section only describes trivial how tos, see the [reference](../modules.html) for a list of available schemas and modifiers.

### Simple schemas (primitives)

Let’s start with a string.

```ts
import { x } from 'unhoax'

// parsing – safe by default.
x.string.parse('Hello, World!') // => { success: true, value: 'Hello, World!' }
x.string.parse(42)
// => { success: false, schemaName: string, input: unknown, issues: x.ParseIssue[] }

// unsafe parsing (throws if validation fails)
x.unsafeParse(x.string, 'Hello, World!') // => 'Hello, World!'
x.unsafeParse(x.string, 42) // => throws
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

## Inference

```ts
import { x } from 'unhoax'

const schema = x.object({ name: x.string })
type Test = x.TypeOf<typeof schema>
declare const test: Test // { name: string }
```

## Transforming Data

Use the `x.map(mapper)` function:

```ts
import pipe from 'just-pipe'
import { x } from 'unhoax'

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

const email = pipe(x.string, x.guardAs('Email', isEmail)) // Schema<Email>
```
