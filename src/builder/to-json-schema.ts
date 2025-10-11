import type { JSONSchema7 } from 'json-schema'
import type { SchemaConfig } from './Schema'
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
export function toJsonSchema(schema: SchemaConfig<any>): JSONSchema7 {
  const meta = schema.meta ?? {}
  if (schema.name.startsWith('Array<'))
    return toJsonSchemaArray(schema as ArraySchema<any, any>)
  if (schema.name.startsWith('Set<'))
    return toJsonSchemaSet(schema as SetSchema<any, any>)
  if (schema.name.startsWith('Record<'))
    return toJsonSchemaRecord(schema as RecordSchema<any, any, any>)

  if (schema.name === 'string')
    return toJsonSchemaString(schema as StringSchema)
  if (schema.name === 'boolean') return { type: 'boolean' }
  if (schema.name === 'date') return toJsonSchemaDate(schema)
  if (numberSchemaNames.has(schema.name)) return toJsonSchemaNumber(schema)

  if ('literal' in meta) return toJsonSchemaLiterals(schema)
  if ('union' in meta) return toJsonSchemaUnion(schema)
  if ('props' in schema)
    return toJsonSchemaObject(schema as ObjectSchema<any, any>)
  if ('items' in schema)
    return toJsonSchemaTuple(schema as TupleSchema<any, any>)

  throw new Error('unsupported schema')
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

function toJsonSchemaUnion(schema: SchemaConfig<any>): JSONSchema7 {
  const schemas = Object.values(
    schema.meta!.union.schemas!,
  ) as SchemaConfig<any>[]
  const anyOf = schemas
    .map(toJsonSchema)
    .filter((s) => !s.enum || s.enum.length !== 0)
  return anyOf.length === 1 ? anyOf[0] : { anyOf }
}

function toJsonSchemaLiterals(schema: SchemaConfig<any>): JSONSchema7 {
  const literals = schema.meta!.literal.literals as Literal[]
  return {
    enum: literals.filter((literal) => literal !== undefined), // `undefined` is not supported
  }
}

function toJsonSchemaArray(schema: ArraySchema<any, any>): JSONSchema7 {
  return {
    type: 'array',
    items: toJsonSchema(schema.item),
    minItems: finiteOrUndefined(schema.refinements?.size?.min),
    maxItems: finiteOrUndefined(schema.refinements?.size?.max),
  }
}

function toJsonSchemaNumber(schema: SchemaConfig<any>): JSONSchema7 {
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

function toJsonSchemaDate(schema: SchemaConfig<any>): JSONSchema7 {
  return {
    type: 'string',
    format: 'date-time',
    // @ts-ignore for a lot of reasons…
    formatMinimum: schema.refinements?.min?.value?.toISOString(),
    // @ts-ignore for a lot of reasons…
    formatMaximum: schema.refinements?.max?.value?.toISOString(),
  }
}

function toJsonSchemaSet(schema: SetSchema<any, any>): JSONSchema7 {
  return {
    ...toJsonSchemaArray(schema as any),
    uniqueItems: true,
  }
}

function toJsonSchemaObject(schema: ObjectSchema<any, any>): JSONSchema7 {
  const properties = Object.fromEntries(
    Object.entries(schema.props).map(([key, value]) => [
      key,
      toJsonSchema(value),
    ]),
  )
  const required = Object.keys(schema.props).filter((key) => {
    const meta = schema.props[key].meta ?? {}
    const hasUndefinedLiteral =
      'union' in meta &&
      Object.values(meta.union.schemas!).some((s) => {
        const meta = s.meta ?? {}
        return 'literal' in meta && meta.literal.literals.includes(undefined)
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

function toJsonSchemaTuple(schema: TupleSchema<any, any>): JSONSchema7 {
  const items = schema.items as unknown as SchemaConfig<any>[]
  return {
    type: 'array',
    items: items.map(toJsonSchema),
    minItems: items.length,
    maxItems: items.length,
  }
}

function toJsonSchemaRecord(schema: RecordSchema<any, any, any>): JSONSchema7 {
  return {
    type: 'object',
    additionalProperties: toJsonSchema(schema.value),
  }
}
