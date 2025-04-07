---
title: 3b. Custom Type – First Name
category: Guide
---

## Introduction

It is very common to bring your own types, I built this library specifically for that actually ; because we all have our concepts which vary on the industry we work in and how our business models are defined.

Let’s consider a first name. Depending on the domain, it will have some constraints, for instance:

- min 3 chars
- max 80 chars
- only letters and dashes

It is a stupid spec, but it will do for this example.

## Code, I want code!

Well, that’s typically where the `pipe` approach helps improving readability of the various constraints we may have:

```ts
import { x } from 'unhoax'
import pipe from 'just-pipe'

type FirstName = Branded<string, 'FirstName'>

const firstNameSchema = pipe(
  x.string, // base type

  // apply some constraints
  x.size({ min: 3, max: 80, reason: 'firstNameSize' }),
  x.pattern(/^[A-z-]+$/i, { reason: 'onlyLettersDashesAndSpaces' }),

  // now that we are sure it complies to our spec, let's cast it
  x.map((name) => name as FirstName),
)
// Tada: Schema<FirstName>

firstNameSchema.parse('Jack') // { result: true, value: FirstName }
firstNameSchema.parse('a') // { result: false, error: … } // not enough chars
```
