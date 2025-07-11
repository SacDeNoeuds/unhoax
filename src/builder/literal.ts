import { fromGuard } from './from-guard'

export type Literal = string | number | boolean | null | undefined
const isLiteral =
  <L extends [Literal, ...Literal[]]>(...literals: L) =>
  (value: unknown): value is L[number] =>
    literals.some((literal) => value === literal)

/**
 * @category Reference
 * @example
 * ```ts
 * const schema = x.literal('a', 42, true, null, undefined)
 *
 * assert(schema.parse('a').value === 'a')
 * assert(schema.parse(42).value === 42)
 * assert(schema.parse(true).value === true)
 * assert(schema.parse(null).value === null)
 * assert(schema.parse(undefined).value === undefined)
 *
 * assert(schema.parse('b').success === false)
 * assert(schema.parse(43).success === false)
 * assert(schema.parse(false).success === false)
 * ```
 */
export function literal<L extends [Literal, ...Literal[]]>(...literals: L) {
  return Object.assign(fromGuard('literal', isLiteral(...literals)), {
    meta: { literal: { literals } },
  })
}
