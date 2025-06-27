import { number, object } from 'decoders'

interface Position {
  x: number
  y: number
}

export const decoder = object<Position>({
  x: number,
  y: number,
})
