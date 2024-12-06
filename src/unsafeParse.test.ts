import { describe } from 'node:test'
import { expect, it } from 'vitest'
import { string } from './primitives'
import { unsafeParse } from './unsafeParse'

describe('unsafeParse', () => {
  it('does not throw', () => {
    expect(() => unsafeParse(string, 'hello')).not.toThrow()
  })
  it('throws', () => {
    expect(() => unsafeParse(string, 42)).toThrow()
  })
})
