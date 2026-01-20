import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { Sized } from '../common/Sized'
import { Factory, type SchemaLike } from './SchemaFactory'
import type { SizedSchemaRefiners } from './SizedSchemaRefiners'

function isIterableObject<T>(input: unknown): input is Iterable<T> {
  return (
    // @ts-ignore
    typeof input === 'object' && typeof input?.[Symbol.iterator] === 'function'
  )
}

export const defineIterableSchema = <T, Input, Acc extends Sized>(
  name: string,
  itemSchema: SchemaLike<T, Input>,
  createAcc: () => Acc,
  addToAcc: (acc: Acc, item: T) => void,
  maxLength: number,
) => {
  const schema = new Factory({
    name,
    item: itemSchema,
    defaultMaxSize: maxLength,
    parser: (input, context) => {
      if (!isIterableObject(input)) return failure(context, name, input)
      const acc = createAcc()
      let index = 0
      for (const value of input) {
        const result = withPathSegment(context, index, (nestedContext) => {
          // schema.parse pushes an issue if it fails
          return itemSchema.parse(value, nestedContext)
        })
        if (result.success) addToAcc(acc, result.value)
        index++
      }
      return success(context, acc)
    },
  }) as SchemaLike<Acc, Iterable<Input>> & SizedSchemaRefiners
  return schema.size({ max: maxLength })
}
