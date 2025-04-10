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

const footballer = x.object({
  preferredFoot: x.literal('left', 'right'),
  maxScoredGamePerSeason: x.number,
})

// It works the same for named objects:
const person = x.object('Person', { … })
const footballer = x.object('Footballer', { … })
```

### Intersection – merging 2 objects

```ts
import { x } from "unhoax";

const footballerPerson = x.object({
  ...person.props,
  ...footballer.props,
})

// it works the same for named objects:
const footballerPerson = x.object('FootballerPerson', {
  ...person.props,
  ...footballer.props,
})

const result = footballerPerson.parse({
  name: 'toto',
  age: 21,
  preferredFoot: 'left',
  maxScoredGamePerSeason: 5,
})

typeof result: {
  success: true,
  value: {
    name: 'toto',
    age: 21,
    preferredFoot: 'left',
    maxScoredGamePerSeason: 5
  }
}
```

### Pick – use only some properties

```ts
import { x } from "unhoax"
import pick from "just-pick"

const nameOnlyProps = pick(person.props, ["name"])
const withNameOnly = x.object(nameOnlyProps)

// it works with named objects too:
const withNameOnly = x.object('PersonWithNameOnly', nameOnlyProps)

const result = withNameOnly.parse({ name: 'toto', age: 21 })

typeof result: {
  success: true,
  value: { name: 'toto' },
}
```

### Omit – remove some properties

```ts
import { x } from "unhoax";
import omit from "just-omit";

const withoutAgeProps = omit(person.props, ["age"])
const withoutAge = x.object(withoutAgeProps);

const result = withoutAge.parse({ name: 'toto', age: 21 })

typeof result: {
  success: true,
  value: { name: 'toto' },
}
```
