# Migrating from zod

| Zod                                              | Unhoax                                         |
| ------------------------------------------------ | ---------------------------------------------- |
| z.array(itemSchema)                              | x.array(itemSchema)                            |
| z.any()                                          | ❌                                             |
| z.bigint()                                       | x.bigint                                       |
| z.boolean()                                      | x.boolean                                      |
| z.coerce.number()                                | x.coercedNumber                                |
| z.coerce.number().int()                          | x.coercedInteger                               |
| z.custom(test, message?)                         | x.fromGuard(schemaName, guardFn)               |
| z.date()                                         | x.date                                         |
| z.discriminatedUnion('type', [schema1, schema2]) | x.variant('type', [schema1, schema2])          |
| z.enum(EnumType)                                 | x.Enum(EnumType)                               |
| z.instanceOf(ClassType)                          | x.instanceOf(ClassType)                        |
| z.integer()                                      | x.integer                                      |
| z.literal(value)                                 | x.literal(value)                               |
| z.map(itemSchema, valueSchema)                   | x.mapOf(itemSchema, valueSchema)               |
| z.nativeEnum(EnumType)                           | x.Enum(EnumType)                               |
| z.never()                                        | ❌                                             |
| z.number()                                       | x.number                                       |
| z.object({ a: schema })                          | x.object({ a: schema })                        |
| z.object({ a: schema }).merge(otherObject)       | x.object({ a: schema }).intersect(otherObject) |
| z.object({ a: … }).omit('a')                     | x.object({ a: schema }).omit('a')              |
| z.object({ a: schema }).pick('a')                | x.object({ a: schema }).pick('a')              |
| z.object({ a: schema }).extend(otherObject)      | x.object({ a: schema }).intersect(otherObject) |
| z.object({ a: schema }).partial()                | 🚧                                             |
| z.record(keySchema, valueSchema)                 | x.record(keySchema, valueSchema)               |
| z.set(itemSchema)                                | x.setOf(itemSchema)                            |
| z.string()                                       | x.string                                       |
| z.tuple([schema1, schema2])                      | x.tuple(schema1, schema2)                      |
| z.union([schema1, schema2])                      | x.union(schema1, schema2)                      |
| z.unknown()                                      | x.unknown                                      |

## Size Utilities

| Zod                                     | Unhoax                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| z.string().min(5)                       | x.string.size({ min: 5 })                                |
| z.string().max(5)                       | x.string.size({ max: 5 })                                |
| z.string().min(5).max(10)               | x.string.size({ min: 5, max: 10 })                       |
| z.array(itemSchema).min(5)              | x.array(itemSchema).size({ min: 5 })                     |
| z.array(itemSchema).max(10)             | x.array(itemSchema).size({ max: 10 })                    |
| z.array(itemSchema).length(7)           | x.array(itemSchema).size({ min: 7, max: 7 })             |
| z.set(itemSchema).min(5)                | x.setOf(itemSchema).size({ min: 5 })                     |
| z.set(itemSchema).max(10)               | x.setOf(itemSchema).size({ max: 10 })                    |
| z.set(itemSchema).length(7)             | x.setOf(itemSchema).size({ min: 7, max: 7 })             |
| z.map(keySchema, valueSchema).min(5)    | x.mapOf(keySchema, valueSchema).size({ min: 5 })         |
| z.map(keySchema, valueSchema).max(10)   | x.mapOf(keySchema, valueSchema).size({ max: 10 })        |
| z.map(keySchema, valueSchema).length(7) | x.mapOf(keySchema, valueSchema).size({ min: 7, max: 7 }) |

## Numeric Utilities

| Zod                                            | Unhoax                         |
| ---------------------------------------------- | ------------------------------ |
| z.number().gt(1)                               | x.number.greaterThan(1)        |
| z.bigint().gt(1)                               | x.bigint.greaterThan(1n)       |
| z.date().gt(new Date(…))                       | x.bigint.dateThan(new Date(…)) |
| z.number().gte(1)                              | x.number.min(1)                |
| z.bigint().gte(1)                              | x.bigint.min(1n)               |
| z.date().gte(new Date(…)) or .min(new Date(…)) | x.date.min(new Date(…))        |
| z.number().lt(10)                              | x.number.lowerThan(10)         |
| z.bigint().lt(10)                              | x.bigint.lowerThan(10n)        |
| z.date().lt(new Date(…))                       | x.date.lowerThan(new Date(…))  |
| z.number().lte(10) or .max(10)                 | x.number.max(10)               |
| z.bigint().lte(10) or .max(10)                 | x.bigint.max(10n)              |
| z.date().lte(new Date(…)) or .max(new Date(…)) | x.date.max(new Date(…))        |
| z.number().int()                               | x.integer                      |
| z.number().positive()                          | x.number.min(1)                |
| z.bigint().positive()                          | x.bigint.min(1n)               |
| z.number().nonnegative()                       | x.number.min(0)                |
| z.bigint().nonnegative()                       | x.bigint.min(0n)               |
| z.number().negative()                          | x.number.lowerThan(0)          |
| z.number().nonpositive()                       | x.number.max(0)                |

## Utilities

| Zod                    | Unhoax                |
| ---------------------- | --------------------- |
| schema.nullable()      | schema.nullable()     |
| schema.optional()      | schema.optional()     |
| z.number().default(42) | x.number.optional(42) |
| z.transform(mapper)    | x.map(mapper)         |

## Laziness

Is to be handled this way:

```ts
const leafSchema = x.object({})

const treeSchema = x.object({
  get children() {
    return x.union(leafSchema, treeSchema)
  },
})
```
