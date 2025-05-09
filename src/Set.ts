import { array } from './array'
import { standardize, type Schema } from './Schema'

/**
 * @category Schema Definition
 * @see {@link Set}
 */
export interface SetSchema<T> extends Schema<Set<T>> {
  readonly item: Schema<T>
}

export { Set_ as Set }

/**
 * @category Schema
 * @see {@link array}
 * @see {@link Map}
 * @see {@link record}
 * @see {@link object}
 * @see {@link tuple}
 * @example
 * ```ts
 * import { x } from 'unhoax'
 *
 * x.Set(x.string).parse(new Set(['a', 'b']))
 * // { success: true, value: Set { 'a', 'b' } }
 *
 * x.Set(x.string).parse(['a', 'b'])
 * // { success: true, value: Set { 'a', 'b' } }
 * ```
 */
function Set_<T>(item: Schema<T>) {
  const name = `Set<${item.name}>`
  const arraySchema = array(item)
  return standardize<SetSchema<T>>({
    name,
    item,
    parse(input, context) {
      const result = arraySchema.parse(input, context)
      if (result.success) return { success: true, value: new Set(result.value) }
      return {
        success: false,
        schemaName: name,
        input: result.input,
        issues: result.issues.map((issue) => {
          return issue.schemaName === arraySchema.name
            ? { ...issue, schemaName: name }
            : issue
        }),
      }
    },
  })
}
