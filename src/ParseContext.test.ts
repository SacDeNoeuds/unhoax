import { describe } from 'node:test'
import { expect, it } from 'vitest'
import { createParseContext, withPathSegment } from './ParseContext'

describe('withPathSegment', () => {
  const context = createParseContext('Toto', 42)
  const withSegment = withPathSegment(context, 0)

  it('keeps `issues` reference', () => {
    expect(withSegment.issues).toBe(context.issues)
  })

  it('keeps root schema & input', () => {
    expect(withSegment.rootSchemaName).toBe(context.rootSchemaName)
    expect(withSegment.rootInput).toEqual(context.rootInput)
  })

  it('adds segment to path', () => {
    expect(withSegment.path).toEqual([0])
  })
})
