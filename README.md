<p align="center">
  <img alt="Package Size" src="https://deno.bundlejs.com/badge?q=unhoax&treeshake=[{+x+}]">
  <img alt="Total coverage" src="https://raw.githubusercontent.com/SacDeNoeuds/unhoax/refs/heads/main/badges/coverage-total.svg">
  <!-- <img alt="Dependency Count" src="https://badgen.net/bundlephobia/dependency-count/unhoax"> -->
  <a href="https://www.npmjs.com/package/unhoax">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/unhoax.svg">
  </a>
</p>

<p align="center">

A [Standard Schema](https://standardschema.dev/)-compliant library intended for **data safety**, leveraging **concise & elegant types** to prevent unreadable 100+ lines TypeScript error messages.

Following the unix mindset, `unhoax` proposes **less** features than other libraries, encouraging you to build your own custom schemas when relevant, ie: [email schemas](#custom-types).

</p>

---

## Installation

```bash
npm i -S unhoax
```

## Getting Started

Check out the [documentation website](https://sacdenoeuds.github.io/unhoax/), you may want to start with the [getting started guide](https://sacdenoeuds.github.io/unhoax/) 😊

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
-->

### Custom Types

```ts
import { x } from 'unhoax'

type Email = …
declare function isEmail(value: string): value is Email

const emailSchema = x.string.guardAs('Email', isEmail) // Schema<Email>
```

## Safety first

There are default **size guards** everywhere, to diminish the risk of **Denial of Service attacks**, **resource exhaustion** and **oversized payload**.

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

## Generating random fixtures from your schemas

Visit [unhoax-chance](https://sacdenoeuds.github.io/unhoax-chance/) to see how to generate random fixtures from your schemas using [ChanceJS](https://chancejs.com/).

## The purpose of this library – Why yet-another?

See [here](https://sacdenoeuds.github.io/unhoax/why-yet-another.html)
