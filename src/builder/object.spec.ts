import { describe, expect, it } from 'vitest'
import { x } from './main'

describe(x.object.name, () => {
  it('parses every key even when refiners fail', () => {
    const schema = x.object({
      a: x.string.size({ min: 1 }),
      b: x.string.size({ min: 2 }),
    })
    const result = schema.parse({ a: '', b: '1' })
    expect(result.success).toBe(false)
    if (result.success) throw new Error('')
    expect(result.issues).toHaveLength(2)
  })
})
