import { literal } from './literal'
import type { Schema } from './Schema'

interface Enum {
  [key: string]: string | number
}

/**
 * @category Schema
 * @example Parses as-const enum
 * ```ts
 * const Direction = { Left: 'Left', Right: 'Right' } as const;
 *
 * const schema = x.Enum(Direction)
 * assert(schema.parse('Left').success === true)
 * assert(schema.parse('Left').value === Direction.Left)
 *
 * assert(schema.parse('Letf').success === false)
 * ```
 * @example Parses an enum with values
 * ```ts
 * enum Direction { Left = 'Left', Right = 'Right' }
 *
 * const schema = x.Enum(Direction)
 * assert(schema.parse('Left').success === true)
 * assert(schema.parse('Left').value === Direction.Left)
 *
 * assert(schema.parse('Letf').success === false)
 * ```
 * @example Parses an enum without values
 * ```ts
 * enum Direction { Left, Right }
 *
 * const schema = x.Enum(Direction)
 * assert(schema.parse(0).success === true)
 * assert(schema.parse(0).value === Direction.Left)
 *
 * assert(schema.parse(-1).success === false)
 * ```
 */
export function Enum<T extends Enum>(Enum: T): Schema<T[keyof T]> {
  // @ts-ignore
  return literal(...Object.values(Enum))
}
