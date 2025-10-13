import type { JSONSchema7 } from 'json-schema'
import type { SchemaAdditionalProps } from './Schema'
import type { SchemaLike } from './SchemaFactory'
import type { SetSchema } from './Set'
import type { ArraySchema } from './array'
import type { Literal } from './literal'
import type { ObjectSchema } from './object'
import type { RecordSchema } from './record'
import type { StringSchema } from './string'
import type { TupleSchema } from './tuple'

const numberSchemaNames = new Set([
  'number',
  'integer',
  'unsafeNumber',
  'unsafeInteger',
])

type SchemaIsh = SchemaLike<any, any> & SchemaAdditionalProps

export function toJsonSchema(schema: SchemaIsh): JSONSchema7 {
  if (schema.name.startsWith('Array<'))
    return toJsonSchemaArray(schema as ArraySchema<any>)
  if (schema.name.startsWith('Set<'))
    return toJsonSchemaSet(schema as SetSchema<any>)
  if (schema.name.startsWith('Record<'))
    return toJsonSchemaRecord(schema as RecordSchema<any, any>)

  if (schema.name === 'string')
    return toJsonSchemaString(schema as unknown as StringSchema)
  if (schema.name === 'boolean') return { type: 'boolean' }
  if (schema.name === 'date') return toJsonSchemaDate(schema)
  if (numberSchemaNames.has(schema.name)) return toJsonSchemaNumber(schema)

  if (schema.literals) return toJsonSchemaLiterals(schema)
  if (schema.schemas) return toJsonSchemaUnion(schema)
  if (schema.props)
    return toJsonSchemaObject(schema as unknown as ObjectSchema<any>)
  if (schema.items) return toJsonSchemaTuple(schema as TupleSchema<any>)

  console.debug('schema', schema)
  throw new Error('unsupported schema', {
    cause: {
      schema,
    },
  })
}

function finiteOrUndefined(number: unknown) {
  return Number.isFinite(number) ? (number as number) : undefined
}

function toJsonSchemaString(schema: StringSchema): JSONSchema7 {
  return {
    type: 'string',
    minLength: finiteOrUndefined(schema.refinements?.size?.min),
    maxLength: finiteOrUndefined(schema.refinements?.size?.max),
    pattern: schema.refinements?.pattern?.pattern?.toString().slice(1, -1),
  }
}

function toJsonSchemaUnion(schema: SchemaIsh): JSONSchema7 {
  const schemas = Object.values(schema.schemas) as SchemaIsh[]
  const anyOf = schemas
    .map(toJsonSchema)
    .filter((s) => !s.enum || s.enum.length !== 0)
  return anyOf.length === 1 ? anyOf[0] : { anyOf }
}

function toJsonSchemaLiterals(schema: SchemaIsh): JSONSchema7 {
  const literals = schema.literals as Literal[]
  return {
    enum: literals.filter((literal) => literal !== undefined), // `undefined` is not supported
  }
}

function toJsonSchemaArray(schema: ArraySchema<any>): JSONSchema7 {
  return {
    type: 'array',
    items: toJsonSchema(schema.item as any),
    minItems: finiteOrUndefined(schema.refinements?.size?.min),
    maxItems: finiteOrUndefined(schema.refinements?.size?.max),
  }
}

function toJsonSchemaNumber(schema: SchemaIsh): JSONSchema7 {
  return {
    type: schema.name.toLowerCase().replace('unsafe', '') as
      | 'number'
      | 'integer',
    [schema.refinements?.min?.exclusive ? 'exclusiveMinimum' : 'minimum']:
      finiteOrUndefined(schema.refinements?.min?.value),
    [schema.refinements?.max?.exclusive ? 'exclusiveMaximum' : 'maximum']:
      finiteOrUndefined(schema.refinements?.max?.value),
  }
}

function toJsonSchemaDate(schema: SchemaIsh): JSONSchema7 {
  return {
    type: 'string',
    format: 'date-time',
    // @ts-ignore for a lot of reasons…
    formatMinimum: schema.refinements?.min?.value?.toISOString(),
    // @ts-ignore for a lot of reasons…
    formatMaximum: schema.refinements?.max?.value?.toISOString(),
  }
}

function toJsonSchemaSet(schema: SetSchema<any>): JSONSchema7 {
  return {
    ...toJsonSchemaArray(schema as any),
    uniqueItems: true,
  }
}

function toJsonSchemaObject(schema: ObjectSchema<any>): JSONSchema7 {
  const properties = Object.fromEntries(
    Object.entries(schema.props).map(([key, value]) => [
      key,
      toJsonSchema(value as SchemaIsh),
    ]),
  )
  const required = Object.keys(schema.props).filter((key) => {
    const s = schema.props[key] as SchemaIsh | undefined
    const hasUndefinedLiteral =
      s?.schemas &&
      Object.values(s.schemas).some((s) => {
        return (s as SchemaIsh).literals.includes(undefined)
      })
    return !hasUndefinedLiteral
  })

  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  }
}

function toJsonSchemaTuple(schema: TupleSchema<any>): JSONSchema7 {
  const items = schema.items as unknown as SchemaIsh[]
  return {
    type: 'array',
    items: items.map(toJsonSchema),
    minItems: items.length,
    maxItems: items.length,
  }
}

function toJsonSchemaRecord(schema: RecordSchema<any, any>): JSONSchema7 {
  return {
    type: 'object',
    additionalProperties: toJsonSchema(schema.value as any),
  }
}
