# `x.{anySchema}`

All the utilities to transform, bend or map unhoax schemas.

## `x.{anySchema}.convertTo`

```ts
const numberFromString = x.string.convertTo(x.number, Number)
assert(numberFromString.parse('42').value === 42)
assert(numberFromString.parse('toto').success === false)
assert(numberFromString.parse(42).success === false) // input needs to be a string first, then coerced as a number

assert(numberFromString.name === 'number')
```

## `x.{anySchema}.guardAs`

```ts
type Email = string & { _tag: 'Email' }
const isEmail = (s: string): s is Email => s.includes('@')

const schema = x.string.guardAs('Email', isEmail)
assert(schema.parse('hey').success === false)
assert(schema.parse('hey@yo').success === true)
```

## `x.{anySchema}.map`

```ts
import { capitalize } from './test-utils'

const capitalized = x.string.map(capitalize)
assert(capitalized.parse('hey').value === 'Hey')
```

## `x.{anySchema}.nullable`

```ts
const schema = x.string.nullable()
assert(schema.parse(null).success === true)
assert(schema.parse(null).value === null)
assert(schema.parse(null).value === null)
assert(schema.parse('abc').value === 'abc')
```

**with default value**

```ts
const schema = x.string.nullable(42)
assert.deepEqual(schema.parse(null), { success: true, value: 42 })
```

## `x.{anySchema}.optional`

```ts
const schema = x.string.optional()
assert(schema.parse(undefined).success === true)
assert(schema.parse(undefined).value === undefined)
assert(schema.parse('abc').value === 'abc')
```

**with default value**

```ts
const schema = x.string.optional(42)
assert(schema.parse(undefined).success === true)
assert(schema.parse(undefined).value === 42)
```

## `x.{anySchema}.recover`

```ts
const schema = x.string.recover(() => 42)
assert(schema.parse('hey').value === 'hey')
assert(schema.parse(true).value === 42)
```

## `x.{anySchema}.refine`

```ts
import { isCapitalized } from './test-utils'

const capitalized = x.string.refine('capitalized', isCapitalized)
assert(capitalized.parse('hey').success === false)
assert(capitalized.parse('Hey').success === true)
```
