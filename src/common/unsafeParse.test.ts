import { describe } from 'node:test'
import { expect, it } from 'vitest'
import { x } from '../builder/main'
import { unsafeParse } from './unsafeParse'

describe('unsafeParse', () => {
  it('does not throw', () => {
    expect(() => unsafeParse(x.string, 'hello')).not.toThrow()
  })
  it('throws', () => {
    expect(() => unsafeParse(x.string, 42)).toThrow()
  })
})
