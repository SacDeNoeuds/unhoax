---
title: 2. Intersect, pick & omit
category: Guide
---

### Introduction

When manipulating objects, it is fairly common to use operations like `intersection`, `pick` or `omit`.
They all have their TypeScript typing:

- intersect: `A & B`
- pick: `Pick<T, Key>`
- omit: `Omit<T, Key>`

Let’s consider those schemas:

```ts
import { x } from 'unhoax'

const person = x.object('Person', {
  name: x.string,
  age: x.number,
})

const developer = x.object({
  preferredKeyboardType: x.literal('compact', 'external', '…'),
  codingStyle: x.literal('functional', 'object-oriented', 'data-oriented'),
})
```

### Pick – use only some properties

```ts
import { x } from "unhoax"
import pipe from 'just-pipe'

const schema = pipe(person, x.pick('name'))

const result = schema.parse({ name: 'toto' })
typeof result: {
  success: true,
  value: { name: 'toto' },
}
```

### Omit – remove some properties

```ts
import { x } from "unhoax";
import pipe from 'just-pipe'

const schema = pipe(person, x.omit('age'))
const result = schema.parse({ name: 'toto' })

typeof result: {
  success: true,
  value: { name: 'toto' },
}
```

### Intersection – merging 2 objects

```ts
import { x } from "unhoax";

const developerPerson = x.object({
  ...person.props,
  ...developer.props,
})

const result = developerPerson.parse({
  name: 'Jack',
  age: 21,
  preferredKeyboardType: 'compact',
  codingStyle: 'functional',
})

typeof result: {
  success: true,
  value: {
    name: 'Jack',
    age: 21,
    preferredKeyboardType: 'compact',
    codingStyle: 'functional',
  }
}
```
