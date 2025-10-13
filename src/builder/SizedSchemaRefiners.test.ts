import { describe, expect, test } from 'vitest'
import { untrimmedString } from './string'

describe('SizedSchema', () => {
  describe('mapping & refinements', () => {
    test('they are applied in correct order', () => {
      const string = untrimmedString
        .size({ min: 0, max: 5 })
        .map((x) => x.trim())
        .size({ min: 2, max: 4 })
      expect(string.parse(' hey  ').success).toBe(false) // 1st untrimmed refinement
      expect(string.parse(' h ').success).toBe(false) // 2nd trimmed refinement
      expect(string.parse('hey').success).toBe(true)
    })
  })
})
