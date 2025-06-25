# Getting Started

This library is intended for **data safety** and leverages **concise & elegant types** to prevent unreadable 100+ lines TypeScript error messages.

For a detailed explanation with examples, see [why yet-another?](./why-yet-another.md)

Following the unix mindset, `unhoax` proposes **less** features than other libraries, encouraging you to build your own custom schemas when relevant, ie: [email schemas](#with-predicates-–-isx-value-t-boolean).

## Installation

```sh
npm install --save unhoax
```

## Basic Usage

This section only describes trivial how tos, see the [reference](/reference) for a list of available schemas and modifiers.

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
const userSchema: x.ObjectSchema<User>
// simple type, right?

// infer-driven:
const userSchema = x.object({
  id: x.number,
  name: x.string,
  email: x.string,
})
type User = x.TypeOf<typeof userSchema>

userSchema.parse({ … })
// { result: true, value: { id: number, … } } <- `User` is not properly named

const userSchema: x.ObjectSchema<{
    id: number;
    name: string;
    email: string;
}>
// simple type, right?
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
import { x } from 'unhoax'

const upperCaseString = x.string.map((string) => string.toUpperCase())
```

## Refinements

Checkout the [reference](/reference) for built-in refinements.

### With predicates – `isX(value: T): boolean`

```ts
import { x } from 'unhoax'
import { isEmail } from 'is-email'

const emailSchema = x.string.refine('Email', isEmail)
```

### With guards – `isX(value: …): value is T`

```ts
import { x } from 'unhoax'

type Email = …
declare function isEmail(value: string): value is Email

const emailSchema = x.string.guardAs('Email', isEmail) // Schema<Email>
```
