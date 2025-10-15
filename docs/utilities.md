# `intersect`

Unless you absolutely want to use some library function, just use spreading. Cf the example without unhoax.

**Without unhoax**

```ts
const a = x.object({ name: x.string })
const b = x.object({ name: x.number, age: x.number })
const c = x.object({ ...a.props, ...b.props })

assert(c.parse({ name: 12, age: 18 }).success === true)
```

**With unhoax**

```ts
import { intersect } from './object.helpers'

const a = x.object({ name: x.string })
const b = x.object({ name: x.number, age: x.number })
const c = intersect(a, b)

assert(c.parse({ name: 12, age: 18 }).success === true)
```

# `omit`

I recommend using your own implementation of `omit` considering you usually have one in your project

**With unhoax utility**

```ts
import { omit } from './object.helpers'

const schema = x.object({ name: x.string, age: x.number })
const nextSchema = omit(schema, 'age')

assert.deepEqual(
  nextSchema.parse({ name: 'Jack' }),
  { success: true, value: { name: 'Jack' } }, // ✅
)

assert.deepEqual(
  nextSchema.parse({ name: 'Jack', age: 18 }),
  { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
)
```

**Without unhoax utility**

```ts
import { default as justOmit } from 'just-omit'

const schema = x.object({ name: x.string, age: x.number })
const nextSchema = x.object(justOmit(schema.props, 'age'))

assert.deepEqual(
  nextSchema.parse({ name: 'Jack', age: 18 }),
  { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
)
```

# `pick`

I recommend using your own implementation of `pick` considering you usually have one in your project

**With unhoax utility**

```ts
import { pick } from './object.helpers'

const schema = x.object({ name: x.string, age: x.number })
const nextSchema = pick(schema, 'name')

assert.deepEqual(
  nextSchema.parse({ name: 'Jack' }),
  { success: true, value: { name: 'Jack' } }, // ✅
)

assert.deepEqual(
  nextSchema.parse({ name: 'Jack', age: 18 }),
  { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
)
```

**Without unhoax utility**

```ts
import { default as justPick } from 'just-pick'

const schema = x.object({ name: x.string, age: x.number })
const nextSchema = x.object(justPick(schema.props, 'name'))

assert.deepEqual(
  nextSchema.parse({ name: 'Jack', age: 18 }),
  { success: true, value: { name: 'Jack' } }, // ✅ only `name` is parsed
)
```
