import { literal } from "./primitives"
import type { Schema } from "./Schema"

interface Enum {
  [key: string]: string | number
}

export function Enum<T extends Enum>(Enum: T): Schema<T[keyof T]> {
  // @ts-ignore
  return literal(...Object.values(Enum))
}
