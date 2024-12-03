import { describe, expect, it } from 'vitest'
import { string } from "./primitives"
import { refineAs } from "./refine"

describe('refineAs', () => {
  type Email = string & { _tag: "Email" }
  const isEmail = (value: string): value is Email => value.includes('@')
  
  const refineAsEmail = refineAs("Email", isEmail)
  const emailSchema = refineAsEmail(string)

  it('parses an email', () => {
    const result = emailSchema.parse("a@a.com")
    expect(result).toEqual({ success: true, value: "a@a.com" })
  })

  it('fails parsing a non-email string', () => {
    const result = emailSchema.parse("a")
    expect(result).toEqual({
      success: false,
      error: {
        input: "a",
        schemaName: "string",
        issues: [
          { schemaName: "string", input: "a", path: [], refinement: 'Email' },
        ],
      },
    })
  })
})

