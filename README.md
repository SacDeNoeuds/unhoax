<p align="center">
  <img alt="Package Size" src="https://deno.bundlejs.com/badge?q=unhoax&treeshake=[{+x+}]">
  <img alt="Total coverage" src="https://raw.githubusercontent.com/SacDeNoeuds/unhoax/refs/heads/main/badges/coverage-total.svg">
  <img alt="Dependency Count" src="https://badgen.net/bundlephobia/dependency-count/unhoax">
  <a href="https://www.npmjs.com/package/unhoax">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/unhoax.svg">
  </a>
</p>

<p align="center">
A safe-by-default schema library that is type/data-driven rather than schema-centric: you bring your entity types, we do not lose you with complex schema typings.
<br>
Particularly lightweight and extendible by design.
</p>

---

## Installation

```bash
npm i -S unhoax
```

Although not required, I recommend using the library with a `pipe` function, like `pipe` from [`just-pipe`](https://github.com/angus-c/just?tab=readme-ov-file#just-pipe) or `pipeWith` from [`pipe-ts`](https://github.com/unsplash/pipe-ts)

## Getting Started

Check out the [documentation website](https://sacdenoeuds.github.io/unhoax/), you may want to start with the [getting started guide](https://sacdenoeuds.github.io/unhoax/documents/1._Getting_Started.html) 😊

## Quick Sample – we want code!

```ts
import { x } from 'unhoax'

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

## Generating random fixtures from your schemas

Visit [unhoax-chance](https://sacdenoeuds.github.io/unhoax-chance/) to see how to generate random fixtures from your schemas using [ChanceJS](https://chancejs.com/).

## The purpose of this library – Why yet-another?

See [here](https://sacdenoeuds.github.io/unhoax/documents/5._Why_yet-another_schema_library__.html)
