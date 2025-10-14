# Utilities

## `StringSchema`

string-specific schema methods

### `StringSchema.pattern`

**accepting only alpha letters**

```ts
const schema = x.string.pattern(/^[a-zA-Z]+$/)

assert(schema.parse('abc').success === true)
assert(schema.parse('ab3').success === false)
```

## `NumericSchema`

Utilities for every numeric schemas like `x.bigint`, `x.date` and `x.number`.

### `NumericSchema.greaterThan`

**number**

```ts
const schema = x.number.greaterThan(42)
assert(schema.parse(43).success === true)
assert(schema.parse(42).success === false)
```

- **Date**

```ts
const schema = x.date.greaterThan(new Date(2025))
assert(schema.parse(new Date(2025, 1)).success === true)
assert(schema.parse(new Date(2025)).success === false)
```

**bigint**

```ts
const schema = x.bigint.greaterThan(42n)
assert(schema.parse(43n).success === true)
assert(schema.parse(42n).success === false)
```

**meta**

```ts
const schema = x.number.greaterThan(22, 'threshold in percent')
assert(schema.refinements?.min.value === 22)
assert(schema.refinements?.min.description === 'threshold in percent')
assert(schema.refinements?.min.exclusive === true)
```

### `NumericSchema.lowerThan`

**number**

```ts
const schema = x.number.lowerThan(42)
assert(schema.parse(41).success === true)
assert(schema.parse(42).success === false)
```

**Date**

```ts
const schema = x.date.lowerThan(new Date(2025))
assert(schema.parse(new Date(2024)).success === true)
assert(schema.parse(new Date(2025)).success === false)
```

**bigint**

```ts
const schema = x.bigint.lowerThan(42n)
assert(schema.parse(41n).success === true)
assert(schema.parse(42n).success === false)
```

**meta**

```ts
const schema = x.number.lowerThan(22, 'threshold in percent')
assert(schema.refinements?.max.value === 22)
assert(schema.refinements?.max.description === 'threshold in percent')
assert(schema.refinements?.max.exclusive === true)
```

### `NumericSchema.max`

**number**

```ts
const schema = x.number.max(42)
assert(schema.parse(42).success === true)
assert(schema.parse(43).success === false)
```

**Date**

```ts
const schema = x.date.max(new Date(2025))
assert(schema.parse(new Date(2025)).success === true)
assert(schema.parse(new Date(2025, 0, 1)).success === false)
```

**bigint**

```ts
const schema = x.bigint.max(42n)
assert(schema.parse(42n).success === true)
assert(schema.parse(43n).success === false)
```

**meta**

```ts
const schema = x.number.max(22, 'threshold in percent')
assert(schema.refinements?.max.value === 22)
assert(schema.refinements?.max.description === 'threshold in percent')
assert(schema.refinements?.max.exclusive === false)
```

### `NumericSchema.min`

**number**

```ts
const schema = x.number.min(42)
assert(schema.parse(42).success === true)
assert(schema.parse(41).success === false)
```

**Date**

```ts
const schema = x.date.min(new Date(2025))
assert(schema.parse(new Date(2025)).success === true)
assert(schema.parse(new Date(2024)).success === false)
```

**bigint**

```ts
const schema = x.bigint.min(10n)
assert(schema.parse(10n).success === true)
assert(schema.parse(9n).success === false)
```

**meta**

```ts
const schema = x.number.min(18, 'threshold in percent')
assert(schema.refinements?.min.value === 18)
assert(schema.refinements?.min.description === 'threshold in percent')
assert(schema.refinements?.min.exclusive === false)
```

## `SizedSchema`

Utilities for every sized schemas like `x.array`, `x.setOf`, `x.mapOf` and `x.string`.

### `SizedSchema.size`

**min size, no description**

```ts
const sized = x.string.size({ min: 3 })
// or x.array(…), x.setOf(…), x.mapOf(…)
assert(sized.parse('hey').success === true)
```

**string min, max and description**

```ts
const description = 'short first name'
const schema = x.string.size({ min: 3, max: 5, description })
// or x.array(…), x.setOf(…), x.mapOf(…)

assert(schema.parse('hey').success === true)
assert(schema.parse('he').success === false)
assert(schema.parse('hey yo').success === false)
assert(schema.refinements.size.description === description)
```

**basic array min/max**

```ts
const schema = x.array(x.number).size({ min: 1, max: 3 })
assert(schema.parse([1]).success === true)
assert(schema.parse([]).success === false)
assert(schema.parse([1, 2, 3, 4]).success === false)
```

**basic Set min/max**

```ts
const schema = x.setOf(x.number).size({ min: 1, max: 3 })
assert(schema.parse(new Set([1])).success === true)
assert(schema.parse(new Set()).success === false)
assert(schema.parse(new Set([1, 2, 3, 4])).success === false)
```

**basic Map min/max**

```ts
const schema = x.mapOf(x.number, x.number).size({ min: 1, max: 3 })
assert(schema.parse(new Map([[1, 1]])).success === true)
assert(schema.parse(new Map()).success === false)
assert(
  schema.parse(
    new Map([
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ]),
  ).success === false,
)
```

**failure**

```ts
const sized = x.string.size({ min: 3 })

assert(sized.parse('he').success === false)
assert.deepEqual(sized.parse('he').issues, [
  {
    schemaName: 'string',
    message: 'not a string (size)',
    path: [],
    refinement: 'size',
    input: 'he',
  },
])
```
