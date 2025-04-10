---
title: 3a. Custom Type – Email
category: Guide
---

## Introduction

It is very common to bring your own, I built this library specifically for that actually ; because we all have our concepts which vary on the industry we work in and how our business models are defined.

The "email" concept may be extraordinarily different from one environment to another:

In some cases you will brand your email type: `type Email = Branded<string, 'Email'>`, in some other a simple `string` will do.

In some cases, you will use more accurate sub-types:

```ts
type DisguisedEmail = Branded<string, 'DisguisedEmail'> // ie: me+disguisement@gmail.com
type UniqueEmail = Branded<string, 'UniqueEmail'>
type Email = DisguisedEmail | UniqueEmail

// accept only non-disguised emails at sign up.
type SignUp = (email: UniqueEmail) => …
```

There is **no way** I will know about any of that. It’s all up to you.

I can recommend using [`is-email`](https://www.npmjs.com/package/is-email) though.

## Without branded types

```ts
import { x } from 'unhoax'

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
import { x } from 'unhoax'

const guardAsEmail = x.guardAs('Email', isEmail)
const emailSchema = guardAsEmail(x.string)
// x.Schema<Email>

// or, using pipe
import pipe from 'just-pipe'

const emailSchema = pipe(x.string, x.guardAs('Email', isEmail))
// x.Schema<Email>
```

## Summing up – `x.refine` vs `x.guardAs`

- `x.refine` does **not** change the schema type: `x.refine(schema<T>, isX) => schema<T>`
- `x.guardAs` **does** change the schema type: `x.guardAs(schema<T>, isU) => schema<U>`
