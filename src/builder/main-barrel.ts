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
export type { TypeOf } from '../common/Schema'
export { array, type ArraySchema } from './array'
export { bigint, type BigIntSchema } from './bigint'
export { boolean } from './boolean'
export { coercedInteger, coercedNumber } from './coerce'
export { date, type DateSchema } from './date'
export { Enum } from './Enum'
export { fromGuard, type Guard } from './from-guard'
export { instanceOf } from './instance-of'
export { literal } from './literal'
export { mapOf, type MapSchema } from './Map'
export {
  integer,
  number,
  unsafeInteger,
  unsafeNumber,
  type NumberSchema,
} from './number'
export type { NumericBuilder } from './NumericSchema'
export { object, type ObjectBuilder, type ObjectSchema } from './object'
export { record, type RecordSchema } from './record'
export type { BaseSchema, Schema } from './Schema'
export { unknown } from './SchemaFactory'
export { setOf, type SetSchema } from './Set'
export type { SizedBuilder } from './SizedSchema'
export { string, untrimmedString, type StringSchema } from './string'
export { tuple, type TupleSchema } from './tuple'
export { union, variant } from './union'
