import { literal } from './primitives'
import type { Schema } from './Schema'

interface Enum {
  [key: string]: string | number
}

/**
 * @category Schema
 * @example Parses any enum-like
 * ```ts
 * const Direction = { Left: 'Left', Right: 'Right' } as const;
 * enum Direction { Left = 'Left', Right = 'Right' }
 * enum Direction { Left, Right }
 *
 * const schema = x.Enum(Direction)
 * schema.parse(Direction.Left) // { success: true, value: Direction.Left })
 * ```
 */
export function Enum<T extends Enum>(Enum: T): Schema<T[keyof T]> {
  // @ts-ignore
  return literal(...Object.values(Enum))
}
