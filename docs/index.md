# Getting Started

A [Standard Schema](https://standardschema.dev/)-compliant library intended for **data safety**, leveraging **concise & elegant types** to prevent unreadable 100+ lines TypeScript error messages.

For a detailed explanation with examples, see [why yet-another?](./why-yet-another.md)

Following the unix mindset, `unhoax` proposes **less** features than other libraries, encouraging you to build your own custom schemas when relevant, ie: [email schemas](#with-predicates-–-isx-value-t-boolean).

## Installation

```sh
npm install --save unhoax
```

## Basic Usage

This section only describes trivial how tos, see the [reference](/schemas) for a list of available schemas and utilities.

```ts
import { x } from 'unhoax'

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
userSchema.parse({ … })
// { result: true, value: User } <- `User` is properly named via intellisense

// hovering on `userSchema` prompts this ; simple type, right?
const userSchema: x.ObjectSchema<User>

// infer-driven:
const userSchema = x.object({
  id: x.number,
  name: x.string,
  email: x.string,
})
type User = x.TypeOf<typeof userSchema>

userSchema.parse({ … })
// { result: true, value: { id: number, … } } <- `User` is not properly named

// hovering on `userSchema` prompts this ; simple type, right?
const userSchema: x.ObjectSchema<{
    id: number;
    name: string;
    email: string;
}>
```

## Inference

```ts
import { x } from 'unhoax'

const schema = x.object({ name: x.string })
type Test = x.TypeOf<typeof schema>
declare const test: Test // { name: string }
```

<!-- ## Transforming Data

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
``` -->
