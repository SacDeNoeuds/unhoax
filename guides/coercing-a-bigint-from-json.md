---
title: Coercing a bigint from JSON
category: Guide
---

## Introduction

It is common to parse JSON-based inputs, in which case the Date will be presented as `string` or as `number`.

If possible, I would advise to use `replacer` of `JSON.stringify(data, replacer, …)` and `reviver` of `JSON.parse(string, reviver)` to handle bigint values.

Now this is not always feasible, so let’s do it using our schemas:

## Implementation

What we will do is parsing any BigInt input and create a BigInt from it:

```ts
import { x } from 'unhoax'

type Input = Parameters<typeof BigInt>[0] // string | number
const inputSchema: x.Schema<Input> = x.union(x.string, x.number)

export const bigint: x.Schema<bigint> = x.map(BigInt)(inputSchema)

// or, using pipe:
import pipe from 'just-pipe'

export const bigint: x.Schema<bigint> = pipe(
  x.union(x.string, x.number),
  x.map(BigInt),
)
```

Now we introduced a bug: the BigInt constructor throws if the input is invalid:

```ts
BigInt('not a number') // throws !

const bigint = pipe(
  x.union(x.string, x.number),
  x.flatMap((stringOrNumber) => {
    try {
      return BigInt(stringOrNumber)
    } catch (error) {
      return {
        success: false,
        error: {
          input: stringOrNumber,
          schemaName: 'bigint',
          issues: [],
        },
      }
    }
  }),
)
```
