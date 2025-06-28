# JSON Schema

## Basic Usage

unhoax provides JSON Schema (7) support:

```ts
import { x, toJsonSchema } from 'unhoax'

const schema = toJsonSchema(x.string)
const schema = toJsonSchema(x.number)
const schema = toJsonSchema(x.object({ … }))
const schema = toJsonSchema(x.array({ … }))
```

## Limitations

The JSON Schema world disables some features enabled by the parsing approach:

- transformation = `mySchema.map(() => …)`, no support in JSON Schema
- conversion = `mySchema.convertTo(otherSchema, castFn)`, no support in JSON Schema

Why: In JSON Schema, there is no output transforming. It’s the price of validating instead of parsing.

Examples of dropped built-in features:

- `string` -> cannot trim the output anymore in JSON Schema.
- `coercedXxx` -> impossible in JSON Schema.
- `bigint` -> not a JSON concept.
- `mapOf(key, value) -> Map<Key, Value>` -> `Map` is not a JSON concept.

## Support table

| Type              | Supported                                   |
| ----------------- | ------------------------------------------- |
| `array`           | ✅                                          |
| `bigint`          | ❌ JSON-incompatible                        |
| `boolean`         | ✅                                          |
| `coercedInteger`  | ❌                                          |
| `coercedNumber`   | ❌                                          |
| `date`            | ✅                                          |
| `Enum`            | ✅                                          |
| `integer`         | ✅                                          |
| `literal`         | ✅                                          |
| `mapOf`           | ❌ JSON-incompatible                        |
| `number`          | ✅                                          |
| `object`          | ✅                                          |
| `record`          | ✅ with no promise on the record `Key` type |
| `setOf`           | ⚠️ converted as array with unique items     |
| `string`          | ✅ (no trimming, though)                    |
| `tuple`           | ✅                                          |
| `union`           | ✅                                          |
| `unknown`         | ❌                                          |
| `unsafeInteger`   | ✅                                          |
| `unsafeNumber`    | ✅                                          |
| `untrimmedString` | ✅                                          |
| `variant`         | ✅                                          |
