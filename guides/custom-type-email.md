---
title: 3a. Custom Type – Email
category: Guide
---

## Introduction

It is very common to bring your own, I built this library specifically for that actually ; because we all have our concepts which vary on the industry we work in and how our business models are defined.

## Without branded types

```ts
import * as x from 'unhoax'

declare const isEmail: (value: string) => boolean

const refineAsEmail = x.refine('Email', isEmail)
const emailSchema = refineAsEmail(x.string)
// x.Schema<string>

// or, using pipe
import pipe from 'just-pipe'

const emailSchema = pipe(x.string, x.refine('Email', isEmail))
```

## With branded types

Let’s consider a simple branded string to represent an email:

```ts
type Email = string & { _tag: 'Email' }

// this time, we have a type guard.
declare const isEmail: (value: string) => value is Email
```

Now let’s build the schema:

```ts
import * as x from 'unhoax'

const refineAsEmail = x.refineAs('Email', isEmail)
const emailSchema = refineAsEmail(x.string)
// x.Schema<Email>

// or, using pipe
import pipe from 'just-pipe'

const emailSchema = pipe(x.string, x.refineAs('Email', isEmail))
// x.Schema<Email>
```

## Summing up – `x.refine` vs `x.refineAs`

- `x.refine` does **not** change the schema type: `x.refine(schema<T>, isX) => schema<T>`
- `x.refineAs` **does** change the schema type: `x.refineAs(schema<T>, isU) => schema<U>`
