# Why coercion

And why coercion instead of codec or serializer/deserializer like [io-ts](https://github.com/gcanti/io-ts) (❤️) or [@sinclair/typebox](https://github.com/sinclairzx81/typebox)?

## TL;DR – Because of [Standard Schema](https://standard-schema.org/)

To me, [Standard Schema](https://standard-schema.org/) is an excellent initiative and has great adoption. Building anything StandardSchema-compliant opens the door to [tRPC](https://trpc.io/), [ts-rest](https://ts-rest.com/) and [a ton of others tools](https://github.com/standard-schema/standard-schema#what-tools--frameworks-accept-spec-compliant-schemas).

From my point of view, the trade-off is acceptable and I am OK delegating serializing to clumsy APIs like `JSON.stringify(data, replacer)` and parsing to `JSON.parse(jsonAsText, reviver)`.

See MDN for documentation of `JSON.stringify`'s [replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#using_a_function_as_replacer) and `JSON.parse`'s [reviver](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_the_reviver_parameter).

## Example with `JSON.stringify/parse`

```ts
import { x } from 'unhoax'

const itemQuantitySchema = x.number.refine('Quantity', (value) => value > 0)
const itemNameSchema = x.string

const shoppingListSchema = x.object({
  name: x.string,
  items: x.mapOf(itemNameSchema, itemQuantitySchema),
})

const shoppingListData = {
  name: 'Groceries',
  items: new Map([
    ['Apple', 5],
    ['Carrot', 8],
  ]),
}

const brokenJson = JSON.stringify(shoppingListData)
// '{ "name":"Groceries", "items": {} }' <-- not items in there !

const json = JSON.stringify(shoppingListData, (key, value) => {
  if (value instanceof Map) return [...value.entries()]
  return value
})
// '{ "name": "Groceries", "items": [["Apple", 5], ["Carrot", 8]] }'

const parsedJson = JSON.parse(json)
const shoppingList2 = shoppingListSchema.parse(parsedJson)
// No need to provide a `reviver`, the `x.mapOf` schema can
// parse entries directly. We only need the `replacer` to
// serialize a Map as JSON.
```
