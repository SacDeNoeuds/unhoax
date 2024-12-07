![Package Size](https://deno.bundlejs.com/badge?q=unhoax&treeshake=[*]) ![Total coverage](./badges/coverage-total.svg) <!-- ![Branches](./badges/coverage-branches.svg) ![Functions](./badges/coverage-functions.svg) ![Lines](./badges/coverage-lines.svg) ![Statements](./badges/coverage-statements.svg) -->

A safe-by-default schema library that is type/data-driven rather than schema-centric: you bring your entity types, we do not lose you with complex schema typings.

Particularly lightweight and extendible by design.

## Installation

```bash
npm i -S unhoax
```

Although not required, I recommend using the library with a `pipe` function, like `pipe` from [`just-pipe`](https://github.com/angus-c/just?tab=readme-ov-file#just-pipe) or `pipeWith` from [`pipe-ts`](https://github.com/unsplash/pipe-ts)

## Getting Started

Check out the [documentation website](https://sacdenoeuds.github.io/unhoax/).

Checkout the [getting started guide](https://sacdenoeuds.github.io/unhoax/documents/1._Getting_Started.html).

### Quick Sample – we want code!

```ts
import * as x from 'unhoax'

// Type-Driven:
type Person = { name: string; age: number }
const personSchema = x.object<Person>({
  name: x.string,
  age: x.number,
})

// or using type inference
type Person = x.TypeOf<typeof personSchema>

// parsing safely
const result = personSchema.parse({ name: …, age: … })

if (result.success) result.value // Person
else result.error // x.ParseError

// parsing unsafely
try {
  const result = x.unsafeParse(personSchema, { name: …, age: … })
  result // Person
} catch (err) {
  // although `err` is typed as `unknown`, this is what you get inside:
  err // Error
  err.cause // x.ParseError
}
```
