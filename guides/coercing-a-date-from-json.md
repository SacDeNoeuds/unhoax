---
title: Coercing a Date from JSON
category: Guide
---

## Introduction

It is common to parse JSON-based inputs, in which case the Date will be presented as `string` or as `number`.

If possible, I would advise to use `replacer` of `JSON.stringify(data, replacer, …)` and `reviver` of `JSON.parse(string, reviver)` to handle bigint values.

Now this is not always feasible, so let’s do it using our schemas:

## Implementation – let’s re-implement `x.date`

What we will do is parsing any BigInt input and create a BigInt from it:

```ts
import { x } from 'unhoax'

type DateInput = ConstructorParameters<typeof Date>[0] // Date | string | number
const dateInputSchema: x.Schema<DateInput> = x.union(
  x.instanceOf(Date),
  x.string,
  x.number,
)

const mapDate = x.map((value: DateInput) => new Date(value))
export const date: x.Schema<Date> = mapDate(dateInputSchema)

// or, using pipe:
import pipe from 'just-pipe'

export const date: x.Schema<Date> = pipe(
  x.union(x.instanceOf(Date), x.string, x.number),
  x.map((value) => new Date(value)),
  x.refine('Date', isValidDate),
)

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.valueOf())
}
```
