# unhoax

A schema library that is consumer-centric rather than schema-centric

![Package Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[*])

## Installation

```bash
npm i -S unhoax
```

Although not required, I recommend using the library with a `pipe` function, like `pipeWith` from [`pipe-ts`](https://github.com/unsplash/pipe-ts) or `pipe` from [`just-pipe`](https://github.com/angus-c/just?tab=readme-ov-file#just-pipe)


## Reference

### Parsing

```ts
import { unsafeParse } from 'unhoax'

const result = mySchema.parse(…)
result:
  | { success: true, value: T }
  | { success: false, error: { input, schemaName, issues: …[] } }

// throws an Error with ParseError as the error cause if parsing fails.
const value = unsafeParse(mySchema, input)
value: T
```

### Schemas

#### Primitives

```ts
import {
  boolean,
  string,
  number,
  literal
  untrimmedString, // By default strings are trimmed, use `untrimmedString` if you don't want that

  fromPredicate,
} from 'unhoax'

const myLiteral = literal('oneValue')
const myLiteral = literal('value1', 2, true, …)

type Pixel = `${number}px`
const isPixel = (input: unknown): input is Pixel => …
const pixelSchema = fromPredicate('pixel', isPixel)
pixelSchema: Schema<Pixel>
```

#### Optionals

```ts
import { nullable, nil, optional } from 'unhoax'

const schema = nullable(string) // Schema<string | null>
const schema = optional(string) // Schema<string | undefined>
const schema = nil(string)      // Schema<string | null | undefined>
```

#### Refinements & Custom types

```ts
import { string, refineAs, refine } from 'unhoax'

type Email = string & { _tag: 'Email' }
declare const isEmail: (value: string) => value is Email

const refineAsEmail = refineAs('Email', isEmail)
export const email = refineAsEmail(string)

const isCompanyEmail = (email: Email) => email.endsWith('@my-company.org')

const refineToCompanyEmail = refine('CompanyEmail', isCompanyEmail)
export const companyEmail = refineToCompanyEmail(email) // Schema<Email>
```

The difference between `refine` and `refineAs` is the output type:
```ts
const refineAsEmail = refineAs('email', (value: string) => value is Email)
const refineAsEmail: (schema: Schema<string>) => Schema<Email>
// VS
const refineToCompanyEmail = refine('CompanyEmail', (value: Email) => boolean)
const refineToCompanyEmail: (schema: Schema<Email>) => Schema<Email>
// the output type did NOT change.
```

#### Building complex schemas with `pipe`

```ts
import pipe from 'just-pipe'
import { email } from '…'
import * as x from 'unhoax'

const isCompanyEmail = (email: Email) => email.endsWith('@my-company.org')

const person = object({
  name: pipe(x.string, x.size({ min: 3, max: 50, reason: 'PersonName' })),
  age: pipe(x.integer, x.between(18, 120, 'AgeBoundaries'), x.nil),
  email: pipe(
    email,
    x.refine('CompanyEmail', isCompanyEmail),
    x.optional
  ),
})
```

#### Lazy

```ts
import { Schema, lazy } from 'unhoax'

type BinaryTree = {
  element: string
  left: BinaryTree | null
  right: BinaryTree | null
};

const BinaryTreeSchema: Schema<BinaryTree> = object({
  element: string,
  left: nullable(lazy(() => BinaryTreeSchema)),
  right: nullable(lazy(() => BinaryTreeSchema)),
})
```

#### Composite

```ts
import * as x from 'unhoax'

interface Person {
  name: string
  age: number
}
const person = x.object<Person>({
  name: x.string,
  age: x.number,
})

const arrayOfPersons = x.array(person)
const mapOfPersons = x.Map(x.string, person)
const setOfString = x.Set(x.string)

const tuple = x.tuple(x.string, x.number, x.boolean)
tuple: x.Schema<[string, number, boolean]>
```

#### Unions

```ts
import * as x from 'unhoax'

const stringOrNumber = x.union(x.string, x.number)
stringOrNumber: Schema<string | number>

const bikeSchema = x.object({
  kind: x.literal('Bike'),
  wheels: x.number,
})
const carSchema = x.object({
  kind: x.literal('Car'),
  doors: x.number,
})
const bikeOrCarSchema = x.discriminatedUnion([bikeSchema, carSchema], 'kind')
```

#### Enums

```ts
import * as x from 'unhoax'

// As JavaScript object
const Direction = {
  Left: 'LEFT',
  Right: 'RIGHT',
} as const;

// As TypeScript enum
enum Direction {
  Left = 'LEFT',
  Right = 'RIGHT',
}

// As TypeScript enum
enum Direction {
  Left,
  Right,
}

const schema = x.Enum(Direction)
```

#### Object pick/omit/intersect

```ts
const person = x.object({
  name: x.string,
  age: x.number,
})
const footballer = x.object({
  preferredFoot: x.literal('left', 'right'),
  maxScoredGamePerSeason: x.number,
})

// intersect
const intersectionDemo = x.object({
  ...person.props,
  ...footballer.props,
})

// pick
import pick from 'just-pick'
const pickDemo = x.object(pick(person.props, ['name']))

// omit
import omit from 'just-omit'
const omitDemo = x.object(omit(person.props, ['age']))
```
