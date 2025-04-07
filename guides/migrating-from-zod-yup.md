---
title: 4. Migrating from Zod/Yup
category: Guide
---

| &nbsp; | &nbsp; | &nbsp; |
| --- | --- | --- |
| [Zod](https://www.npmjs.com/package/zod) | [Yup](https://www.npmjs.com/package/yup) | [unhoax](https://www.npmjs.com/package/unhoax) |
| ![Bundle Size](https://deno.bundlejs.com/badge?q=zod&treeshake=[{+z+}]) | ![Bundle Size](https://deno.bundlejs.com/badge?q=yup&treeshake=[*]) | ![Bundle Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[{+x+}]) |

## CheatSheet


```ts
/* Zod / Yup API  ➡    unhoax API */
z.string()        ➡  x.string
z.boolean()       ➡  x.boolean
z.number()        ➡  x.number
z.date()          ➡  x.instanceOf(Date)
z.coerce.date()   ➡  x.date
z.bigint()        ➡  x.instanceOf(BigInt)
z.coerce.bigint() ➡  x.bigint
z.coerce.number() ➡  x.numberFromString

// min/max for sized values: Set, Map, Array, String
z.string().min(n)                     ➡  pipe(x.string, x.size({ min: n }))
z.string().max(n)                     ➡  pipe(x.string, x.size({ max: n }))
z.string().min(n, { message: '…' })   ➡  pipe(x.string, x.size({ min: n, reason: '…' }))
// same for arrays, Set and Map.

// min/max for values: number & Date
z.number().min(n)                     ➡  pipe(x.string, x.min(n))
z.number().max(n)                     ➡  pipe(x.string, x.max(n))
z.number().min(n, { message: '…' })   ➡  pipe(x.string, x.min(n, '…'))

//     or .superRefine()
z.string().refine(() => …)  ➡  1. pipe(x.string, x.refine('<name>', () => …))
z.string().refine(() => …)  ➡  2. pipe(x.string, x.guardAs('<name>', () => …))

z.string().transform(…)     ➡     pipe(x.string, x.map(…))

// composite
z.object({ … })             ➡ x.object({ … })
z.object({ … }).shape       ➡ x.object({ … }).props
z.array(…)                  ➡ x.array(…)
z.set(…)                    ➡ x.Set(…)
z.map(…)                    ➡ x.Map(…)
```
