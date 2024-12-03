import type { ObjectSchema } from './object'
import { createParseContext } from './ParseContext'
import { failure, success } from './ParseResult'
import type { LiteralSchema } from './primitives'
import type { Schema, TypeOfSchema } from './Schema'

export interface UnionSchema<T> extends Schema<T> {
  readonly schemas: Schema<unknown>[]
}
function namedUnion<T extends [Schema<any>, ...Schema<any>[]]>(
  name: string,
  schemas: T
): UnionSchema<TypeOfSchema<T[number]>> {
  return {
    name,
    schemas,
    refinements: [],
    parse: (input, context = createParseContext(name, input)) => {
      for (const schema of schemas) {
        const result = schema.parse(input)
        if (result.success) return success(context, result.value)
      }
      return failure(context, name, input)
    },
  }
}

export function union<T extends [Schema<any>, ...Schema<any>[]]>(
  ...schemas: T
): UnionSchema<TypeOfSchema<T[number]>> {
  const name = schemas.map((schema) => schema.name).join(" | ")
  return namedUnion(name, schemas)
}

export interface DiscriminatedUnionSchema<Discriminant, T> extends UnionSchema<T> {
  discriminant: Discriminant
}

export function discriminatedUnion<T extends [ObjectSchema<any>, ...ObjectSchema<any>[]], Discriminant extends keyof T[number]['props']>(
  schemas: T,
  discriminant: Discriminant,
): DiscriminatedUnionSchema<Discriminant, TypeOfSchema<T[number]>> {
  const name = schemas.map((schema) => (schema.props[discriminant] as LiteralSchema<string>)?.literals[0] ?? schema.name).join(' | ')
  return {
    ...namedUnion(name, schemas),
    discriminant,
  }
}
