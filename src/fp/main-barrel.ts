/**
 * @module unhoax/fp
 * @document ../../guides/object-intersect-pick-omit.md
 * @document ../../guides/getting-started.md
 * @document ../../guides/custom-type-email.md
 * @document ../../guides/custom-type-first-name.md
 * @document ../../guides/migrating-from-zod-yup.md
 * @document ../../guides/why-yet-another.md
 */
// * @document ../guides/migrating-from-x.md
// * @document ../guides/coercing-a-date-from-json.md
// * @document ../guides/coercing-a-bigint-from-json.md
export type { TypeOf } from '../common/Schema'
export { array, type ArraySchema } from './array'
export { bigint } from './bigint'
export { boolean } from './boolean'
export { convertTo } from './convert-to'
export { date } from './date'
export { Enum } from './Enum'
export { fromGuard } from './from-guard'
export { instanceOf } from './instance-of'
export { literal } from './literal'
export { map } from './map'
export { mapOf, type MapSchema } from './map-of'
export { integer, number, unsafeInteger, unsafeNumber } from './number'
export {
  intersect,
  isObject,
  object,
  omit,
  pick,
  type ObjectSchema,
  type PropsOf,
} from './object'
export { record, type RecordSchema } from './record'
export { refine } from './refine'
export { nullable, optional, recover } from './refine-base'
export {
  greaterThan,
  gt,
  gte,
  lowerThan,
  lt,
  lte,
  max,
  min,
} from './refine-numeric'
export { size } from './refine-sized'
export { defineSchema, unknown, type Schema } from './Schema'
export { setOf, type SetSchema } from './set-of'
export { string, untrimmedString } from './string'
export { tuple, type TupleSchema } from './tuple'
export { union, variant } from './union'
