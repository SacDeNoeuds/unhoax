import type { JSONSchema7 } from 'json-schema'
import type { SchemaConfig } from './Schema'
import type { ArraySchema } from './array'
import type { Literal } from './literal'
import type { StringSchema } from './string'

export function toJsonSchema(schema: SchemaConfig<any>): JSONSchema7 {
  const meta = schema.meta ?? {}
  if (schema.name.startsWith('Array<'))
    return toJsonSchemaArray(schema as ArraySchema<any>)

  if (schema.name === 'string')
    return toJsonSchemaString(schema as StringSchema)
  if (schema.name === 'boolean') return { type: 'boolean' }

  if ('literal' in meta) return toJsonSchemaLiterals(schema)
  if ('union' in meta) return toJsonSchemaUnion(schema)

  return {}
}

function finiteOrUndefined(number: unknown) {
  return Number.isFinite(number) ? (number as number) : undefined
}

function toJsonSchemaString(schema: StringSchema): JSONSchema7 {
  return {
    type: 'string',
    minLength: finiteOrUndefined(schema.refinements?.size?.min),
    maxLength: finiteOrUndefined(schema.refinements?.size?.max),
  }
}

function toJsonSchemaUnion(schema: SchemaConfig<any>): JSONSchema7 {
  const schemas = Object.values(
    schema.meta!.union.schemas!,
  ) as SchemaConfig<any>[]
  return {
    anyOf: schemas.map(toJsonSchema),
  }
}

function toJsonSchemaLiterals(schema: SchemaConfig<any>): JSONSchema7 {
  const literals = schema.meta!.literal.literals as Literal[]
  return {
    enum: literals.filter((literal) => literal !== undefined), // `undefined` is not supported
  }
}

function toJsonSchemaArray(schema: ArraySchema<any>): JSONSchema7 {
  return {
    type: 'array',
    items: toJsonSchema(schema.item),
    minItems: finiteOrUndefined(schema.refinements?.size?.min),
    maxItems: finiteOrUndefined(schema.refinements?.size?.max),
  }
}
