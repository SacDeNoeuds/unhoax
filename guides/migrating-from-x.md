---
title: 4. Migrating from X
category: Guide
---

## The Example

Foreword: I use **a domain-driven & type-driven approach** to development. I write types before anything else.<br>
Then I use them to define schemas, use-cases, etc…

All the libraries I will mention are very nice, usually with good type inference and large API surface, so I will stick to the differences.

In general, `unhoax` proposes **less** features, and that is because we all have our development environment and there is no way for me to know about your requirements.

Typically, I will **never** provide any `email` refinement/schema.

<details>
<summary>See why</summary>

<div style="padding-left: 1em; margin-left: 3px; margin-top: 0.5em; border-left: 1px solid currentColor; border-color: color-mix(in srgb, currentColor, var(--color-background) 80%)">

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

There is **NO WAY** I will know about any of that. It’s all up to you.

I can recommend using [`is-email`](https://www.npmjs.com/package/is-email) though.

</div>
</details>

I took the same example as valibot’s [announcement post](https://www.builder.io/blog/introducing-valibot)

```ts
type Email = Branded<string, 'Email'>
type Password = Branded<string, 'Password'>

type LoginData = {
  email: Email
  password: Password
}
```

## unhoax

![Bundle Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[*])

[NPM](https://www.npmjs.com/package/unhoax) | [Website](..) | tree-shakeable


```ts
import * as x from 'unhoax'
import pipe from 'just-pipe' // pick your pkg
import isEmail from 'is-email' // pick your pkg

declare const isEmailGuard: (value: string) => value is Email

const emailSchema = pipe(
  x.string,

  x.refine('Email', isEmail),
  x.map((value) => value as Email),
  // equivalent to:
  x.refineAs('Email', isEmailGuard),
)

const emailSchema: x.Schema<Email, unknown>
// Quite simple, isn't it?
// NB: `unknown` in `Schema<…, unknown>` is the input of the parse function.
// emailSchema.parse(input <- unknown)

const loginDataSchema = x.object<LoginData>({
  email: emailSchema,
  password: passwordSchema,
})
const loginDataSchema: x.ObjectSchema<LoginData, unknown>

const data = x.unsafeParse(loginDataSchema, { … })
const data: LoginData // 🙌
```


## Zod / Yup

![Bundle Size](https://deno.bundlejs.com/badge?q=zod&treeshake=[{+z+}])

[NPM](https://www.npmjs.com/package/zod) | [Website](https://zod.dev/) | not tree-shakeable

They both use the same object-oriented approach, I will cover Zod only.

```ts
const emailSchema = z
  .string()
  .refine(isEmail)
  .transform((value) => value as Email)
  // equivalent to:
  .refine(isEmailGuard)
  satisfies z.Schema<Email, any, unknown>
// I get away with an `any`, which is not super satisfying

const loginDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}) satisfies z.Schema<LoginData, any, unknown>

const data = loginDataSchema.parse({ … })
// This what gets inferred instead of `LoginData` 🤮
const data: {
  email: string & { [tag] … };
  password: string & { [tag] … };
}
```

## Valibot

![Bundle Size](https://deno.bundlejs.com/badge?q=valibot&treeshake=[*])

[NPM](https://www.npmjs.com/package/valibot) | [Website](https://valibot.dev/) | tree-shakeable

I love this library, tried it and got disappointed on _one side **only**_: I want a type-driven approach. If you don’t, then use valibot, really.

The type-driven approach is where I got stuck with valibot, the types are not straightforward **at all** – despite the library being excellent in general.

See for yourself, let’s see how to write the `Email` schema:

```ts
import * as v from 'valibot'

const emailSchema = v.pipe(
  v.string(),
  v.email(), // or v.check(isEmail),
  v.transform((value) => value as Email),
)

const emailSchema: v.SchemaWithPipe<[
  v.StringSchema<undefined>,
  v.EmailAction<string, undefined>,
  v.TransformAction<string, Email>,
]>
// Quite complex, isn’t it ?
```

The same goes for the `LoginData` schema:

```ts
const loginDataSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
}) satisfies TypeToSatisfy

type TypeToSatisfy = v.ObjectSchema<LoginData, unknown> // fails
// fortunately for you I dug:
type TypeToSatisfy = v.BaseSchema<unknown, LoginData, any>
// … if you accept using any, otherwise:
type TypeToSatisfy = v.BaseSchema<
  unknown,
  LoginData,
  v.BaseIssue<unknown>
>

const data = v.parse(loginDataSchema, { … })
// This what gets inferred instead of `LoginData` 🤮
const data: {
  email: string & { [tag] … };
  password: string & { [tag] … };
}
```

## RunTypes

![Bundle Size](https://deno.bundlejs.com/badge?q=runtypes&treeshake=[*])

[NPM](https://www.npmjs.com/package/runtypes) | not tree-shakeable

I did not know this library before writing this one, and quite frankly if I'd choose another it would be the one.

Things RunTypes has and unhoax does not:

- Template literals
- Function Contract – nice, but should not be part of a schema library IMO
- Branding – nice, but should not be part of a schema library IMO
- Pattern matching – nice, but should not be part of a schema library IMO
- Various integrations with tools like json-schema, property-based testing, typing db schemas, and more – Create an issue if you ever want any of that.

Some things that may be missing: Transforming the output: `x.map`, `z.transform`, `v.transform`, …<br>
It is a big deal to me because my code was super simple yet I had to change _already_

Beyond all this, this example is pretty much the same, I was happy-enough about it:

```ts
import * as r from 'runtypes'

const emailSchema = r.String.withGuard(isEmailGuard) satisfies r.Runtype<Email>
const passwordSchema = r.String.withGuard(isPasswordGuard) satisfies r.Runtype<Password>

const loginDataSchema = r.Record({
  email: emailSchema,
  password: passwordSchema,
}) satisfies r.Runtype<LoginData>

const data = loginDataSchema.check({ … })
// runtypes is waaay better than the others at inference:
const data: {
  email: Email;
  password: Password;
}
```

## Superstruct

![Bundle Size](https://deno.bundlejs.com/badge?q=superstruct&treeshake=[*])

[NPM](https://www.npmjs.com/package/superstruct) | [Website](https://superstruct.js.org/) | tree-shakeable

I have one tini-tiny problem with superstruct: either nested coercion is broken, either I did not get it. In both cases it is a problem for me.

Because there is no mapping/transforming mechanism, I have to resort to coercion.

I tried digging into it to issue a PR, and I stopped out of tiredness.

Maybe I got something wrong, anyway just by writing the example, I can say it is too complicated.

The broken piece:

```ts
import * as S from 'superstruct'

const TestName = S.coerce(
  S.object({ value: S.string() }),
  S.string(),
  (name) => ({ value: name }),
)

S.mask('Test', TestName) // { value: 'Test' } ✅

const TestSchema = S.object({ name: TestName })
S.mask({ name: 'Test' }, TestSchema) // { name: { value: 'Test' } } ✅

const Test = S.coerce(
  S.object({ nested: TestSchema }),
  TestSchema,
  (nested: { name: { value: string } }) => ({ nested }),
)

console.info(S.mask({ name: 'Jack' }, Test)) // throws
// I expected `name` to be coerced as `{ value: 'Jack' }`
// but it did not.
```
