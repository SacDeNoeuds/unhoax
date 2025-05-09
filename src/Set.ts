import { array } from './array'
import { map, type Schema } from './Schema'

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
  const toSet = map<T[], Set<T>>(
    (array) => new Set(array),
    name,
    (failure) => ({
      success: false,
      schemaName: name,
      input: failure.input,
      issues: failure.issues.map((issue) => {
        return issue.schemaName === arraySchema.name
          ? { ...issue, schemaName: name }
          : issue
      }),
    }),
  )
  return toSet(arraySchema)
}
