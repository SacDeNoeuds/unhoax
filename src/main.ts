/**
 * @module
 * @document ../guides/object-intersect-pick-omit.md
 * @document ../guides/custom-type-email.md
 * @document ../guides/custom-type-first-name.md
 * @document ../guides/migrating-from-x.md
 *
 * @__document ../guides/coercing-a-date-from-json.md
 * @__document ../guides/coercing-a-bigint-from-json.md
 */
export { array, type ArraySchema } from './array'
export { bigint } from './bigint'
export { date } from './date'
export { Enum } from './enum'
export { fromPredicate } from './fromPredicate'
export { instanceOf } from './instanceOf'
export { lazy } from './lazy'
export { Map, type MapSchema } from './Map'
export { object, partial, type ObjectSchema } from './object'
export { nil, nullable, optional, or } from './or'
export { createParseContext, type ParseContext } from './ParseContext'
export {
  failure,
  success,
  type ParseError,
  type ParseIssue,
  type ParseResult,
} from './ParseResult'
export {
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
  pattern,
  refine,
  refineAs,
  size,
} from './refine'
export {
  flatMap,
  map,
  type InputOfSchema as InputOf,
  type Schema,
  type TypeOfSchema as TypeOf,
} from './Schema'
export { Set, type SetSchema } from './Set'
export { tuple, type TupleSchema } from './tuple'
export {
  discriminatedUnion,
  union,
  // type DiscriminatedUnionSchema,
  type UnionSchema,
} from './union'
export { unsafeParse } from './unsafeParse'
