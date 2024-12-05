import { describe, expect, it } from 'vitest'
import { number } from './primitives'
import { fallback } from './recover'

describe('recover', () => {
  const orEmptyString = fallback('')
  const schema = orEmptyString(number)

  it('does not recover from valid input', () => {
    const result = schema.parse(42)
    expect(result).toEqual({ success: true, value: 42 })
  })

  it('recovers from invalid input', () => {
    const result = schema.parse('hello')
    expect(result).toEqual({ success: true, value: '' })
  })
})
