import type { JSONSchema7 } from 'json-schema'
import type { SchemaConfig } from './Schema'
import type { ArraySchema } from './array'
import type { StringSchema } from './string'

export function toJsonSchema(schema: SchemaConfig<any>): JSONSchema7 {
  if (schema.name.startsWith('Array<'))
    return toJsonSchemaArray(schema as ArraySchema<any>)

  if (schema.name === 'string')
    return toJsonSchemaString(schema as StringSchema)
  return {}
}

// TODO: implement. It will serve to deal with optional and nullable.
function applyModifiers(
  schema: SchemaConfig<any>,
  jsonSchema: JSONSchema7,
): JSONSchema7 {
  return jsonSchema
}

function toJsonSchemaString(schema: StringSchema): JSONSchema7 {
  return applyModifiers(schema, {
    type: 'string',
    maxLength: schema.refinements?.size?.max as number | undefined,
  })
}

function toJsonSchemaArray(schema: ArraySchema<any>): JSONSchema7 {
  return applyModifiers(schema, {
    type: 'array',
    items: toJsonSchema(schema.item),
    minItems: schema.refinements?.size?.min as number | undefined,
    maxItems: schema.refinements?.size?.max as number | undefined,
  })
}
