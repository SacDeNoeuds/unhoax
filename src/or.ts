import { literal } from './primitives'
import type { Schema } from './Schema'
import { union } from './union'

export function or<B>(b: Schema<B>) {
  return <A>(a: Schema<A>) => union(a, b)
}

export const optional = or(literal(undefined))
export const nil = or(literal(undefined, null))
export const nullable = or(literal(null))