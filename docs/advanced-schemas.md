# Advanced Schemas

## `coercedInteger`

```ts
assert(x.coercedInteger.parse('42').value === 42)
assert(x.coercedInteger.parse(true).value === 1)
assert(x.coercedInteger.parse(false).value === 0)

assert(x.coercedInteger.parse('42.2').success === false)
assert(x.coercedInteger.parse('abc').success === false)
assert(x.coercedInteger.parse({}).success === false)
```

## `coercedNumber`

```ts
assert(x.coercedNumber.parse('42').value === 42)
assert(x.coercedNumber.parse('42.2').value === 42.2)
assert(x.coercedNumber.parse(true).value === 1)
assert(x.coercedNumber.parse(false).value === 0)

assert(x.coercedNumber.parse('abc').success === false)
assert(x.coercedNumber.parse({}).success === false)
```

## `fromGuard`

Utility to create schemas.<br>
Used to create most of the primitives.<br>
Can be used to create custom schemas like `Email`.

**rebuilding `x.string`**

```ts
const string = x.fromGuard('string', (input) => typeof input === 'string')
```

**creating an email type**

```ts
type Email = string & { _tag: 'Email' }
declare const isEmail: (input: unknown) => input is Email

const email = x.fromGuard('Email', isEmail)
```

## `unsafeInteger`

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

## `unsafeNumber`

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

## `untrimmedString`

**const schema = x.untrimmedStrin**
g

```ts
assert(x.untrimmedString.parse(' hello ').value === ' hello ')
```
