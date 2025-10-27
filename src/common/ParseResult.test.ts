import { describe, expect, it } from 'vitest'
import { createParseContext } from './ParseContext'
import { failure } from './ParseResult'

describe(failure.name, () => {
  it('makes the message of a schema mismatch', () => {
    const schemaName = 'string'
    const input = 12
    const context = createParseContext(schemaName, input)
    const result = failure(context, schemaName, input)
    expect(result).toEqual({
      success: false,
      input: input,
      schemaName: schemaName,
      issues: [
        {
          input,
          schemaName,
          path: [],
          message: `invalid ${schemaName}`,
        },
      ],
    })
  })

  it('makes the message of a refinement mismatch', () => {
    const schemaName = 'string'
    const input = 'abcdef'
    const refinement = { name: 'size', meta: { min: 1, max: 4 } }
    const context = createParseContext(schemaName, input)
    const result = failure(context, schemaName, input, refinement)
    expect(result).toEqual({
      success: false,
      input: input,
      schemaName: schemaName,
      issues: [
        {
          input,
          schemaName,
          path: [],
          message: `invalid ${refinement.name}`,
          refinement,
        },
      ],
    })
  })
})
