import { describe, expect, it } from 'vitest'
import { x } from './main'

describe('object', () => {
  const schema = x.array(
    x.object({
      name: x.string.size({ min: 1, max: 10 }),
      age: x.number.min(0).max(150),
    }),
  )

  it('fails with 1 issue when name is too short', () => {
    const result = schema.parse([{ name: '', age: 1 }])
    if (result.success) throw new Error('should be failure')
    expect(result.issues).toHaveLength(1)
  })

  it('fails with 2 issues when name is too short and age negative', () => {
    const result = schema.parse([{ name: '', age: -1 }])
    if (result.success) throw new Error('should be failure')
    expect(result.issues).toHaveLength(2)
  })

  it('fails with 2 issues when 0.name is too short and 1.age is negative', () => {
    const result = schema.parse([
      { name: '', age: 0 },
      { name: 'abc', age: -1 },
    ])
    if (result.success) throw new Error('should be failure')
    expect(result.issues).toHaveLength(2)
  })

  it('fails with 3 issues when 0.name is too short and (0 | 1).ages are negative', () => {
    const result = schema.parse([
      { name: '', age: -1 },
      { name: 'abc', age: -1 },
    ])
    if (result.success) throw new Error('should be failure')
    expect(result.issues).toHaveLength(3)
  })
})
