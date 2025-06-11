import { describe, expect, test } from 'vitest'
import { string } from './string'

describe('standard schema integration', () => {
  const standard = string['~standard']
  test('it validates a string', async () => {
    const result = await standard.validate('hello')
    expect(result).toEqual({ success: true, value: 'hello' })
  })
  test('it has correct meta', () => {
    expect(standard).toEqual({
      vendor: 'unhoax',
      version: 1,
      validate: expect.any(Function),
    })
  })
})
