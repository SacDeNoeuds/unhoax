/**
 * @module
 * @document ../guides/object-intersect-pick-omit.md
 * @document ../guides/getting-started.md
 * @document ../guides/custom-type-email.md
 * @document ../guides/custom-type-first-name.md
 * @document ../guides/migrating-from-zod-yup.md
 * @document ../guides/why-yet-another.md
 */
// * @document ../guides/migrating-from-x.md
// * @document ../guides/coercing-a-date-from-json.md
// * @document ../guides/coercing-a-bigint-from-json.md
export { array, type ArraySchema } from './array'
export { bigint } from './bigint'
export { coerce } from './coerce'
export { coerceNumber } from './coerceNumber'
export { date } from './date'
export { Enum } from './enum'
export { fromGuard, type Guard } from './fromGuard'
export { instanceOf } from './instanceOf'
export { lazy } from './lazy'
export { Map, type MapKey, type MapSchema, type MapValue } from './Map'
export {
  object,
  omit,
  partial,
  pick,
  type ObjectSchema,
  type PropsOf,
} from './object'
export { nil, nullable, optional, or } from './or'
export { createParseContext, type ParseContext } from './ParseContext'
export {
  failure,
  success,
  type Failure,
  type ParseError,
  type ParseIssue,
  type ParseResult,
  type Success,
} from './ParseResult'
export {
  boolean,
  integer,
  literal,
  number,
  string,
  symbol,
  unknown,
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
  guardAs,
  max,
  min,
  nonEmpty,
  pattern,
  refine,
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
export { union, variant, type UnionSchema } from './union'
export { unsafeParse } from './unsafeParse'
