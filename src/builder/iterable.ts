import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { Sized } from '../common/Sized'
import type { BaseSchema, Schema } from './Schema'
import { Factory } from './SchemaFactory'
import type { SizedBuilder } from './SizedSchema'

function isIterableObject<T>(input: unknown): input is Iterable<T> {
  return (
    // @ts-ignore
    typeof input === 'object' && typeof input?.[Symbol.iterator] === 'function'
  )
}

export const defineIterableSchema = <T, Acc extends Sized>(
  name: string,
  itemSchema: BaseSchema<T>,
  createAcc: () => Acc,
  addToAcc: (acc: Acc, item: T) => void,
  maxLength: number,
) => {
  const schema = new Factory({
    name,
    // @ts-expect-error it is effectively taken into account.
    item: itemSchema,
    parser: (input, context) => {
      if (!isIterableObject(input)) return failure(context, name, input)
      const acc = createAcc()
      let index = 0
      for (const value of input) {
        const nestedContext = withPathSegment(context, index)
        // schema.parse pushes an issue if it fails
        const result = itemSchema.parse(value, nestedContext)
        if (result.success) addToAcc(acc, result.value)
        index++
      }
      return success(context, acc)
    },
  }) as unknown as Schema<Acc> & SizedBuilder<Acc>
  // @ts-ignore
  schema.defaultMaxSize = maxLength
  return schema.size({ max: maxLength })
}
