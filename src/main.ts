/**
 * @packageDocumentation
 * @categoryDescription Component
 * React Components -- This description is added with the `@categoryDescription` tag
 * on the entry point in src/index.ts
 *
 * @document ../guides/object-intersect-pick-omit.md
 */
export { array, type ArraySchema } from './array'
export { date } from './date'
export { Enum } from './enum'
export { fromPredicate } from './fromPredicate'
export { instanceOf } from './instanceOf'
export { lazy } from './lazy'
export { Map, type MapSchema } from './Map'
export { object, partial, type ObjectSchema } from './object'
export { nil, nullable, optional, or } from './or'
export type { ParseError, ParseIssue, ParseResult } from './ParseResult'
export {
  bigint,
  boolean,
  integer,
  literal,
  number,
  string,
  symbol,
  unsafeInteger,
  unsafeNumber,
  untrimmedString,
  type Literal,
  type LiteralSchema,
} from './primitives'
export { record, type RecordSchema } from './record'
export { fallback, recover } from './recover'
export {
  between,
  greaterThan,
  lowerThan,
  nonEmpty,
  refine,
  refineAs,
  size,
} from './refine'
export { map, type Schema, type TypeOfSchema as TypeOf } from './Schema'
export { Set, type SetSchema } from './Set'
export { tuple, type TupleSchema } from './tuple'
export {
  discriminatedUnion,
  union,
  // type DiscriminatedUnionSchema,
  type UnionSchema,
} from './union'
export { unsafeParse } from './unsafeParse'
