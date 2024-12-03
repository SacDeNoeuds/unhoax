import { describe, expect, it } from "vitest";
import * as S from "./Map";
import { number, string } from "./primitives";

describe("Map schema", () => {
  it("parses a valid input", () => {
    const schema = S.Map(string, number);
    const input = new Map(Object.entries({ a: 1, b: 2 }));
    const result = schema.parse(input);
    expect(result).toEqual({ success: true, value: input });
  });

  it("fails parsing an invalid key", () => {
    const schema = S.Map(number, number);
    const input = new Map(Object.entries({ a: 1, b: 2 }));
    const result = schema.parse(input);
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "Map<number, number>",
        issues: [
          { schemaName: "number", input: "a", path: ["a"] },
          { schemaName: "number", input: "b", path: ["b"] },
        ],
      },
    });
  });

  it("fails parsing an invalid value", () => {
    const schema = S.Map(string, string);
    const input = new Map(Object.entries({ a: 1, b: 2 }));
    const result = schema.parse(input);
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "Map<string, string>",
        issues: [
          { schemaName: "string", input: 1, path: ["a"] },
          { schemaName: "string", input: 2, path: ["b"] },
        ],
      },
    });
  });

  it("fails parsing an non-map", () => {
    const schema = S.Map(string, string);
    const input = 42;
    const result = schema.parse(input);
    expect(result).toEqual({
      success: false,
      error: {
        input,
        schemaName: "Map<string, string>",
        issues: [{ schemaName: "Map<string, string>", input, path: [] }],
      },
    });
  });
});
