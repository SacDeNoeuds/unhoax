# JSON Schema

unhoax provides JSON Schema support:

```ts
import { x, toJsonSchema } from 'unhoax'

const schema = toJsonSchema(x.string)
const schema = toJsonSchema(x.number)
const schema = toJsonSchema(x.object({ … }))
const schema = toJsonSchema(x.array({ … }))
```

## Support table

| Type              | Supported |
| ----------------- | --------- |
| `array`           | ✅        |
| `bigint`          | ❌        |
| `boolean`         | ✅        |
| `coercedInteger`  | ❌        |
| `coercedNumber`   | ❌        |
| `date`            | ✅        |
| `Enum`            | ✅        |
| `integer`         | ✅        |
| `literal`         | ✅        |
| `mapOf`           | ❌        |
| `number`          | ✅        |
| `object`          | ✅        |
| `record`          | ❌        |
| `setOf`           | ✅        |
| `string`          | ✅        |
| `tuple`           | ✅        |
| `union`           | ✅        |
| `unknown`         | ❌        |
| `unsafeInteger`   | ✅        |
| `unsafeNumber`    | ✅        |
| `untrimmedString` | ✅        |
| `variant`         | ✅        |
