---
title: 5. Why yet-another schema library ?
category: Guide
---

### Philosophy

Unhoax encourages **type-driven** and **domain-driven** approach of schemas.
- Type-Driven by making the types and function generics as simple as possible.
- Domain-driven by not making choices on your behalf.
- Domain-driven by making it easy to use Branded Types.

### Example

I took the same example as valibot’s [announcement post](https://www.builder.io/blog/introducing-valibot).

```ts
type Email = Branded<string, 'Email'>
type Password = Branded<string, 'Password'>

type LoginData = {
  email: Email
  password: Password
}
```

### The hidden choice: What is an email?

It may sound like a dumb question, but emails can be primary – `toto@example.com` – or disguised – `toto+test@example.com`.

Depending on your business, you may want one or the other. What should the `z.email()` accept?

Additionally, you may want to exclude some emails from this list, because you know them as fake, typically `@example.com` emails.

And finally, chances are that your project already has an `isEmail` function.

```ts
type DisguisedEmail = Branded<string, 'DisguisedEmail'> // ie: me+disguisement@gmail.com
type UniqueEmail = Branded<string, 'UniqueEmail'>
type Email = DisguisedEmail | UniqueEmail
```

### Unhoax  – [NPM](https://www.npmjs.com/package/unhoax)

![Bundle Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[{+x+}])

```ts
import { x } from 'unhoax'
import pipe from 'just-pipe' // pick your pkg
import isEmail from 'is-email' // pick your pkg

declare const isEmailGuard: (value: string) => value is Email

const emailSchema = pipe(
  x.string,

  x.refine('Email', isEmail),
  x.map((value) => value as Email),
  // equivalent to:
  x.guardAs('Email', isEmailGuard),
)

// when you hover `emailSchema`, that's what you get:
const emailSchema: x.Schema<Email, unknown>
// Quite simple, isn't it?
// NB: `unknown` in `Schema<…, unknown>` is the input of the parse function.
// emailSchema.parse(input <- unknown)

const loginDataSchema = x.object<LoginData>({
  email: emailSchema,
  password: passwordSchema,
})
// when you hover `loginDataSchema`, that's what you get:
const loginDataSchema: x.ObjectSchema<LoginData, unknown>

const data = x.unsafeParse(loginDataSchema, { … })
const data: LoginData // 🙌
```

### Zod / Yup – [NPM (Zod)](https://www.npmjs.com/package/zod)

![Bundle Size](https://deno.bundlejs.com/badge?q=zod&treeshake=[{+z+}])

I’ll cover Zod only, considering Yup is likely to be the same.

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

### Valibot – [NPM](https://www.npmjs.com/package/valibot)

![Bundle Size](https://deno.bundlejs.com/badge?q=valibot&treeshake=[*])

The types are not straightforward **at all** – despite the library being excellent in general.

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

### RunTypes  – [NPM](https://www.npmjs.com/package/runtypes)

![Bundle Size](https://deno.bundlejs.com/badge?q=runtypes&treeshake=[*])


I did not know this library before writing this one, and quite frankly if I'd choose another it would be the one.

Relevant goodies:
- Template literals
- Various integrations with tools like json-schema, property-based testing, typing db schemas, and more – Create an issue if you ever want any of that.

Missing:
- Transforming the output: `x.map`, `z.transform`, `v.transform()`

That being said, IMO the library does too much for a schema library:

- Function Contract
- Branding
- Pattern matching


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

### Superstruct  – [NPM](https://www.npmjs.com/package/superstruct)

![Bundle Size](https://deno.bundlejs.com/badge?q=superstruct&treeshake=[*])

I have one tini-tiny problem with superstruct: either nested coercion is broken, either I did not get it. Or it is just that there's no transform/mapping mechanism. In both cases it is problematic for me.

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
