import { withPathSegment } from '../common/ParseContext'
import { failure, success } from '../common/ParseResult'
import type { Sized } from '../common/Sized'
import { size } from './refine-sized'
import { defineSchema, type Schema } from './Schema'

function isIterableObject<T>(input: unknown): input is Iterable<T> {
  return (
    // @ts-ignore
    typeof input === 'object' && typeof input?.[Symbol.iterator] === 'function'
  )
}

export const defineIterableSchema = <T, Acc extends Sized>(
  name: string,
  itemSchema: Schema<T>,
  createAcc: () => Acc,
  addToAcc: (acc: Acc, item: T) => void,
  maxLength: number,
) => {
  const schema = defineSchema<Acc>({
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
  })
  return size({ max: maxLength })(schema)
}
