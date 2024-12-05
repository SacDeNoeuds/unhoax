---
title: Guide – intersect, pick & omit
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
import * as x from 'unhoax'

const person = x.object({
  name: x.string,
  age: x.number,
})

const footballer = x.object({
  preferredFoot: x.literal('left', 'right'),
  maxScoredGamePerSeason: x.number,
})
```

### Intersection – merging 2 objects

```ts
import * as x from "unhoax";

const footballerPerson = x.object({
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
import * as x from "unhoax"
import pick from "just-pick"

const withNameOnly = x.object(pick(person.props, ["name"]))

const result = withNameOnly.parse({ name: 'toto', age: 21 })

typeof result: {
  success: true,
  value: { name: 'toto' },
}
```

### Omit – remove some properties

```ts
import * as x from "unhoax";
import omit from "just-omit";

const withoutAge = x.object(omit(person.props, ["age"]));

const result = withoutAge.parse({ name: 'toto', age: 21 })

typeof result: {
  success: true,
  value: { name: 'toto' },
}
```

<!-- ```ts
const partial1 = x.partial(person);
partial1.parse({}); // { result: true, value: {} }
const partial2 = x.partial(person, ["age"]);
partial2.parse({ name: "Jack" }); // { result: true, value: { name: "Jack" } }
``` -->
