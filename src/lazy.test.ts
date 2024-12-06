import { describe, expect, it } from 'vitest'
import { lazy } from './lazy'
import { string } from './primitives'
import { size } from './refine'

describe('lazy', () => {
  const minSize = size({ min: 5, reason: 'minSize' })
  const make = () => lazy(() => minSize(string))

  it('has name "lazy" until called', () => {
    const schema = make()
    expect(schema.name).toBe('lazy')
    schema.parse('')
    expect(schema.name).toBe('string')
  })

  it('has no refinements until called', () => {
    const schema = make()
    expect(schema.refinements).toEqual(undefined)
    schema.parse('')
    expect(schema.refinements).toHaveLength(1)
  })

  it('parses a valid input', () => {
    const result = make().parse('12345')
    expect(result).toEqual({ success: true, value: '12345' })
  })

  it('fails parsing a string less than 5 characters', () => {
    const result = make().parse('1234')
    expect(result).toEqual({
      success: false,
      error: {
        input: '1234',
        schemaName: 'string',
        issues: [
          {
            schemaName: 'string',
            input: '1234',
            refinement: 'minSize',
            path: [],
          },
        ],
      },
    })
  })

  it('fails parsing a number', () => {
    const result = make().parse(42)
    expect(result).toEqual({
      success: false,
      error: {
        input: 42,
        schemaName: 'string',
        issues: [{ schemaName: 'string', input: 42, path: [] }],
      },
    })
  })
})
