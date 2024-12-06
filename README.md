![Package Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[*])

A safe-by-default schema library that is type/data-driven rather than schema-centric: you bring your entity types, we do not lose you with complex schema typings.

Particularly lightweight and extendible by design.

## Installation

```bash
npm i -S unhoax
```

Although not required, I recommend using the library with a `pipe` function, like `pipe` from [`just-pipe`](https://github.com/angus-c/just?tab=readme-ov-file#just-pipe) or `pipeWith` from [`pipe-ts`](https://github.com/unsplash/pipe-ts)

## Getting Started

The full documentation is available at [here](https://sacdenoeuds.github.io/unhoax/).

### Type-Driven

Aka writing your type first and then your schema.

```ts
import * as x from 'unhoax'

// Type-Driven:
type Person = { name: string; age: number }
const personSchema = x.object<Person>({
  name: x.string,
  age: x.number,
})
```

### Schema-driven

Aka writing your schema and inferring your type from the schema.

```ts
import * as x from 'unhoax'

const personSchema = x.object({ … })
type Person = x.TypeOf<typeof personSchema>
```

### Parsing Safely

```ts
import * as x from 'unhoax'

const result = personSchema.parse({ name: …, age: … })

if (result.success) result.value // Person
else result.error // x.ParseError
```

### Parsing Unsafely

```ts
import * as x from 'unhoax'

try {
  const result = x.unsafeParse(personSchema, { name: …, age: … })
  result // Person
} catch (err) {
  err // Error
  err.cause // x.ParseError
}
```
