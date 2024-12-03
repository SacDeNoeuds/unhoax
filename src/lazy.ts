import { createParseContext } from './ParseContext'
import type { Schema } from './Schema'

export function lazy<T>(getSchema: () => Schema<T>): Schema<T> {
  let name = 'lazy'
  let refinements: string[] | undefined
  return {
    get name() {
      return name
    },
    get refinements() {
      return refinements
    },
    parse: (input, context) => {
      const schema = getSchema()
      name = schema.name
      refinements = schema.refinements
      return schema.parse(input, context ?? createParseContext(schema.name, input))
    }
  }
}