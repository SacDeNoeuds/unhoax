# Migrating from Zod/Yup

| &nbsp;                                                                  | &nbsp;                                                              | &nbsp;                                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Zod](https://www.npmjs.com/package/zod)                                | [Yup](https://www.npmjs.com/package/yup)                            | [unhoax](https://www.npmjs.com/package/unhoax)                             |
| ![Bundle Size](https://deno.bundlejs.com/badge?q=zod&treeshake=[{+z+}]) | ![Bundle Size](https://deno.bundlejs.com/badge?q=yup&treeshake=[*]) | ![Bundle Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[{+x+}]) |

## CheatSheet

```ts
/* Zod / Yup API  ➡    unhoax API */
z.string()        ➡  x.string
z.boolean()       ➡  x.boolean
z.number()        ➡  x.number
z.date()          ➡  x.date
z.coerce.date()   ➡  x.date
z.bigint()        ➡  x.bigint
z.coerce.bigint() ➡  x.bigint
z.coerce.number() ➡  x.coercedNumber or x.coercedInteger

// min/max for sized values: Set, Map, Array, String
z.string().min(n)                     ➡  x.string.size({ min: n })
z.string().max(n)                     ➡  x.string.size({ max: n })
z.string().min(n, { message: '…' })   ➡  x.string.size({ min: n, reason: '…' })

// `x.array`, `x.setOf` and `x.mapOf` have the same methods:
z.array(…).min(n)                     ➡  x.array(…).size({ min: n })
z.set(…).min(n)                     ➡  x.setOf(…).size({ min: n })
z.map(…).min(n)                     ➡  x.mapOf(…).size({ min: n })

// min/max for numeric values: numbers & Date
z.number().min(n)                     ➡  x.number.min(n)
z.number().max(n)                     ➡  x.number.max(n)
z.number().min(n, { message: '…' })   ➡  x.number.min(n, '…')

// `bigint` and `date` have the same methods:
z.bigint().min(n)                     ➡  x.bigint.min(n)
z.date().min(someDate)                ➡  x.date.min(someDate)

//     or .superRefine()
z.string().refine(() => …)  ➡  1. x.string.refine('<name>', () => …)
z.string().refine(() => …)  ➡  2. x.string.guardAs('<name>', () => …)

z.string().transform(…)     ➡     x.string.map(…)

// composite
z.object({ … })             ➡ x.object({ … })
z.object({ … }).shape       ➡ x.object({ … }).props
z.array(…)                  ➡ x.array(itemSchema)
z.set(…)                    ➡ x.setOf(itemSchema)
z.map(…)                    ➡ x.mapOf(keySchema, valueSchema)
```
