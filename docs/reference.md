# Reference

## array

Parses any iterable to an array.


```ts
const schema = x.array(x.string)

assert.deepEqual(schema.parse(['a']).value, ['a'])
assert.deepEqual(schema.parse(new Set(['a'])).value, ['a'])

assert(schema.parse([1]).success === false)
assert(schema.parse(1).success === false)
assert(schema.parse({}).success === false)
```

**Access the array content schema with `.item`**
```ts
const schema = x.array(x.string)
assert(schema.item === x.string)
```

## bigint

It accepts any input that can construct a BigInt. You can use it to decode JSON coming from a `JSON.parse`


```ts
assert.deepEqual(x.bigint.parse(1), { success: true, value: 1n })
assert.deepEqual(x.bigint.parse('1'), { success: true, value: 1n })
assert.deepEqual(x.bigint.parse(1n), { success: true, value: 1n })
assert.deepEqual(x.bigint.parse(true), { success: true, value: 1n })

assert(x.bigint.parse(1.54).success === false)
assert(x.bigint.parse(1.23).success === false)
assert(x.bigint.parse({}).success === false)
```

## boolean


```ts
const schema = x.boolean
assert(x.boolean.parse(true).success === true)
assert(x.boolean.parse(false).success === true)

assert(x.boolean.parse(1).success === false)
assert(x.boolean.parse('toto').success === false)
```

## coercedInteger


```ts
assert(x.coercedInteger.parse('42').value === 42)
assert(x.coercedInteger.parse(true).value === 1)
assert(x.coercedInteger.parse(false).value === 0)

assert(x.coercedInteger.parse('42.2').success === false)
assert(x.coercedInteger.parse('abc').success === false)
assert(x.coercedInteger.parse({}).success === false)
```

## coercedNumber


```ts
assert(x.coercedNumber.parse('42').value === 42)
assert(x.coercedNumber.parse('42.2').value === 42.2)
assert(x.coercedNumber.parse(true).value === 1)
assert(x.coercedNumber.parse(false).value === 0)

assert(x.coercedNumber.parse('abc').success === false)
assert(x.coercedNumber.parse({}).success === false)
```

## date

It can parse anything the `Date` constructor can take as single parameter.

If you need to accept `Date` only, use `x.instanceOf(Date)`

**const schema = x.dat**
e

**parses a Date**
```ts
const now = new Date()
assert.deepEqual(
x.date.parse(now),
{ success: true, value: now },
)
```

**parses a string**
```ts
const a = '2021-01-02T03:04:05.123Z'
assert.deepEqual(
x.date.parse(a),
{ success: true, value: new Date(a) },
)

const b = '2021-01-02'
assert.deepEqual(
x.date.parse(b),
{ success: true, value: new Date(b) },
)
assert(x.date.parse('oopsie').success === false)
```

**parses a number**
```ts
const timestamp = Date.now()
assert.deepEqual(
x.date.parse(timestamp),
{ success: true, value: new Date(timestamp) },
)
assert(x.date.parse(NaN).success === false)
assert(x.date.parse(() => {}).success === false)
```

## Enum

**Parses as-const enum**
```ts
const Direction = { Left: 'Left', Right: 'Right' } as const;

const schema = x.Enum(Direction)
assert(schema.parse('Left').success === true)
assert(schema.parse('Left').value === Direction.Left)

assert(schema.parse('Letf').success === false)
```

**Parses an enum with values**
```ts
enum Direction { Left = 'Left', Right = 'Right' }

const schema = x.Enum(Direction)
assert(schema.parse('Left').success === true)
assert(schema.parse('Left').value === Direction.Left)

assert(schema.parse('Letf').success === false)
```

**Parses an enum without values**
```ts
enum Direction { Left, Right }

const schema = x.Enum(Direction)
assert(schema.parse(0).success === true)
assert(schema.parse(0).value === Direction.Left)

assert(schema.parse(-1).success === false)
```

## fromGuard

Utility to create schemas.<br>
Used to create most of the primitives.<br>
Can be used to create custom schemas like `Email`.

**rebuilding `x.string`**
```ts
const string = x.fromGuard(
'string',
(input) => typeof input === 'string'
)
```

**creating an email type**
```ts
type Email = string & { _tag: 'Email' }
declare const isEmail: (input: unknown) => input is Email

const email = x.fromGuard('Email', isEmail)
```

## instanceOf

**parsing a Date**
```ts
const schema = x.instanceOf(Date)
assert(schema.parse(new Date()).success === true)
```

**parsing a custom `User` class**
```ts
class User {}
const schema = x.instanceOf(User)
assert(schema.parse(new User()).success === true)
```

## integer

it accepts anything passing the check `Number.isSafeInteger`.


```ts
assert(x.integer.parse(42).success === true)
assert(x.integer.parse(-42).success === true)

assert(x.integer.parse(31.2).success === false)
assert(x.integer.parse(Infinity).success === false)
assert(x.integer.parse(NaN).success === false)
assert(x.integer.parse(1e100).success === false)

assert(x.integer.parse(true).success === false)
assert(x.integer.parse('abc').success === false)
```

## literal


```ts
const schema = x.literal('a', 42, true, null, undefined)

assert(schema.parse('a').value === 'a')
assert(schema.parse(42).value === 42)
assert(schema.parse(true).value === true)
assert(schema.parse(null).value === null)
assert(schema.parse(undefined).value === undefined)

assert(schema.parse('b').success === false)
assert(schema.parse(43).success === false)
assert(schema.parse(false).success === false)
```

## mapOf


```ts
const schema = x.mapOf(x.number, x.string)

const entries = [[1, 'Jack'], [2, 'Mary']]
const map = new Map(entries)

assert.deepEqual(
  schema.parse(entries), // it parses entries
  { success: true, value: map },
)
assert.deepEqual(
  schema.parse(map), // it parses a map
  { success: true, value: map },
)

assert(schema.parse([['1', 'Jack']]).success === false)
assert(schema.parse([['Jack', 1]]).success === false)
```

## number

This schema only accepts **finite** numbers for safety.<br>
If you need full control over your number, use `unsafeNumber` instead.

Basically, it accepts anything passing the check `Number.isFinite`.


```ts
assert(x.number.parse(1).success === true)
assert(x.number.parse(-1.12).success === true)

assert(x.number.parse(Infinity).success === false)
assert(x.number.parse(NaN).success === false)

assert(x.number.parse(true).success === false)
assert(x.number.parse('abc').success === false)
```

## object


```ts
const person = x.object({ name: x.string })
assert(person.parse({ name: 'Jack' }).success === true)
assert(person.parse({ name: 42 }).success === false)
```

**it parses null prototype objects**
```ts
const schema = x.object({ n: x.number })
const a = Object.create(null)
a.n = 1
assert(schema.parse(a).success === true)

assert(schema.parse({ __proto__: null, n: 1 }).success === true)

assert(schema.parse([]).success === false)
assert(schema.parse('abc').success === false)
assert(schema.parse(42).success === false)
assert(schema.parse(new Set()).success === false)
assert(schema.parse(new Map()).success === false)
```

## record


```ts
const schema = x.record(x.string.convertTo(x.number, Number), x.string)

assert.deepEqual(
  schema.parse({ 42: 'hello' }),
  { success: true, value: { 42: 'hello' } },
)
assert(schema.parse({ hello: 42 }).success === false)
assert(schema.parse({ hello: 'world' }).success === false)
```

**failures**
```ts
const schema = x.record(x.string, x.number)
assert(schema.parse([]).success === false)
assert(schema.parse(new Set()).success === false)
assert(schema.parse(new Map()).success === false)
assert(schema.parse({ 1: '12' }).success === false)
```

## setOf

Parses any iterable to an array.


```ts
const schema = x.setOf(x.string)

assert.deepEqual(schema.parse(['a']).value, new Set(['a']))
assert.deepEqual(schema.parse(new Set(['a'])).value, new Set(['a']))

assert(schema.parse([1]).success === false)
assert(schema.parse(1).success === false)
assert(schema.parse({}).success === false)
```

**Access the Set content schema with `.item`**
```ts
const schema = x.setOf(x.string)
assert(schema.item === x.string)
```

## string

This also trims the string. If you do not want this behavior,
explicitly use {@link untrimmedString}


```ts
assert(x.string.parse('  hello  ').value === 'hello')
```

## tuple


```ts
const schema = x.tuple(x.string, x.number)
assert.deepEqual(
  schema.parse(['a', 1]),
  { success: true, value: ['a', 1] },
)

assert.deepEqual(
  schema.parse(['a', 1, 2, 3, 4, 5]),
  { success: true, value: ['a', 1] },
)

assert(schema.parse([1, 2]).success === false)

assert(schema.items[0] === x.string)
assert(schema.items[1] === x.number)
```

**failures**
```ts
const schema = x.tuple(x.string, x.number)
assert(schema.parse(['1']).success === false)
assert(schema.parse(new Set(['1', 2])).success === false)
assert(schema.parse(new Map()).success === false)
assert(schema.parse({ 0: '1', 1: 2 }).success === false)
assert(schema.parse({ 0: '1', 1: 2, length: 2 }).success === false)
```

## union

If you want to use a discriminated union, checkout {@link variant}


```ts
const schema = x.union(x.string, x.number)

assert(schema.parse('a').value === 'a')
assert(schema.parse(42).value === 42)
assert(schema.parse({}).success === false)
```

## unknown

## unsafeInteger

it accepts anything passing the check `Number.isInteger` (not `Number.isSafeInteger`).


```ts
assert(x.unsafeInteger.parse(42).success === true)
assert(x.unsafeInteger.parse(-42).success === true)
assert(x.unsafeInteger.parse(1e100).success === true)

assert(x.unsafeInteger.parse(31.2).success === false)
assert(x.unsafeInteger.parse(Infinity).success === false)
assert(x.unsafeInteger.parse(NaN).success === false)

assert(x.unsafeInteger.parse(true).success === false)
assert(x.unsafeInteger.parse('abc').success === false)
```

## unsafeNumber

⚠️ valid inputs are `Infinity`, `NaN` and unsafe integers.<br>
Basically, anything which passes the check `typeof x = 'number'`.


```ts
assert(x.unsafeNumber.parse(1).success === true)
assert(x.unsafeNumber.parse(-1.12).success === true)

assert(x.unsafeNumber.parse(Infinity).success === true)
assert(x.unsafeNumber.parse(NaN).success === true)

assert(x.unsafeNumber.parse(true).success === false)
assert(x.unsafeNumber.parse('abc').success === false)
```

## untrimmedString

**const schema = x.untrimmedStrin**
g


```ts
assert(x.untrimmedString.parse(' hello ').value === ' hello ')
```

## variant

If you need to use a simple union, checkout {@link union}


```ts
const a = x.object({ type: x.literal('a'), a: x.string }),
const b = x.object({ type: x.literal('b'), b: x.number }),

const schema = x.variant('type', [a, b])

assert.deepEqual(
  schema.parse({ type: 'a', a: 'Hello' }),
  { success: true, value: { type: 'a', a: 'Hello' } }
)
assert.deepEqual(
  schema.parse({ type: 'b', b: 42 }),
  { success: true, value: { type: 'b', b: 42 } }
)

assert(schema.name === 'a | b')
```