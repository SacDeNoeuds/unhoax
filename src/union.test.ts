import { describe, expect, it } from "vitest"
import { object } from "./object"
import { boolean, literal, number, string } from "./primitives"
import type { TypeOfSchema } from './Schema'
import { discriminatedUnion, union } from "./union"

describe("union", () => {
  const schema = union(string, number, boolean)
  it.each<[string, unknown]>([
    ["string", "hello"],
    ["number", 42],
    ["boolean", true],
  ])("parses a %s", (_, validInput) => {
    const result = schema.parse(validInput)
    expect(result).toEqual({ success: true, value: validInput })
  })

  it("fails parsing a date", () => {
    const input = new Date()
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "string | number | boolean",
        issues: [
          { schemaName: "string | number | boolean", input, path: [] },
        ],
      },
    })
  })
})

describe("discriminatedUnion", () => {
  const person = object({ kind: literal('person'), name: string })
  const car = object({ kind: literal("car"), doors: number })
  const bike = object({ kind: literal("bike"), wheels: number })
  const schema = discriminatedUnion([person, car, bike], "kind")
  type Value = TypeOfSchema<typeof schema>

  it.each<Value>([
    { kind: 'person', name: 'john' },
    { kind: 'car', doors: 5 },
    { kind: 'bike', wheels: 2 },
  ])("parses a $kind", (validInput) => {
    const result = schema.parse(validInput)
    expect(result).toEqual({ success: true, value: validInput })
  })

  it('fails parsing a "plane"', () => {
    const input = { kind: 'plane', wings: 2 }
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "person | car | bike",
        issues: [
          { schemaName: "person | car | bike", input, path: [] },
        ],
      },
    })
  })

  it('fails parsing a 42', () => {
    const input = 42
    const result = schema.parse(input)
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "person | car | bike",
        issues: [
          { schemaName: "person | car | bike", input, path: [] },
        ],
      },
    })
  })
})
