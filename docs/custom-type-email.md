# Custom Type – Email

## Introduction

It is very common to bring your own types, I built this library specifically because of that actually ; because we all have our concepts which vary on the industry we work in and how our business models are defined.

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

const emailSchema = x.string.refine('Email', isEmail)
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

const emailSchema = x.string.guardAs('Email', isEmail)
// x.Schema<Email>
```

## Summing up – `x.refine` vs `x.guardAs`

`x.string.refine` **does not** change the schema type: `x.string.refine(name, isU) => Schema<T>`

`x.string.guardAs` **does** change the schema type: `x.string.guardAs(name, isU) => Schema<U>`
