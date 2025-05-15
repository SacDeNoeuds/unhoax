import pipe from 'just-pipe'
import { describe, expect, test } from 'vitest'
import { array } from './array'
import { size } from './refine-sized'
import { string } from './string'

describe('applying size multiple times', () => {
  const schema = pipe(
    array(string),
    size({ min: 0, max: 5 }),
    size({ min: 5, max: 3 }),
    size({ min: 12 }),
    size({ max: 2 }),
  )
  test('it accepts 0 elements', () => {
    expect(schema.parse([]).success).toBe(true)
  })
  test('it accepts 2 elements', () => {
    expect(schema.parse(['a', 'b']).success).toBe(true)
  })
})
