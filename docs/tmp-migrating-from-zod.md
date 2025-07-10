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
