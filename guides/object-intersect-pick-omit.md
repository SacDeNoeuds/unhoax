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

### Pick – use only some properties

```ts
import { x } from "unhoax"
import pipe from 'just-pipe'

// bring your `pick` function from your std:
declare const pick: <Obj, Prop>(...props: Prop[]) => (obj: Obj) => Pick<Obj, Prop>

const schema = pipe(person.props, pick('name'), x.object)

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

// bring your `omit` function from your std:
declare const omit: <Obj, Prop>(...props: Prop[]) => (obj: Obj) => Omit<Obj, Prop>


const schema = pipe(person.props, omit('age'), x.object)
const result = schema.parse({ name: 'toto' })

typeof result: {
  success: true,
  value: { name: 'toto' },
}
```
