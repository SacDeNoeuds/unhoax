import { literal } from "./primitives";
import type { Schema } from "./Schema";

interface Enum {
  [key: string]: string | number;
}

/**
 * @group Schema
 * @category Composite
 * @example
 * ```ts
 * import * as x from 'unhoax'
 *
 * const Direction = {
 *   Left: 'LEFT',
 *   Right: 'RIGHT',
 * } as const;
 *
 * enum Direction {
 *   Left = 'LEFT',
 *   Right = 'RIGHT',
 * }
 * enum Direction {
 *   Left,
 *   Right,
 * }
 * const schema = x.Enum(Direction)
 * const result = schema.parse(Direction.Left)
 * result // { success: true, value: Direction.Left })
 * ```
 */
export function Enum<T extends Enum>(Enum: T): Schema<T[keyof T]> {
  // @ts-ignore
  return literal(...Object.values(Enum));
}
