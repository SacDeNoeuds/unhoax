import { describe, expect, it } from "vitest";
import { lazy } from "./lazy";
import { string } from "./primitives";
import { size } from "./refine";

describe("lazy", () => {
  const minSize = size({ min: 5, reason: "minSize" });
  const schema = () => lazy(() => minSize(string));

  it("parses a valid input", () => {
    const result = schema().parse("12345");
    expect(result).toEqual({ success: true, value: "12345" });
  });

  it("fails parsing a string less than 5 characters", () => {
    const result = schema().parse("1234");
    expect(result).toEqual({
      success: false,
      error: {
        input: "1234",
        schemaName: "string",
        issues: [
          {
            schemaName: "string",
            input: "1234",
            refinement: "minSize",
            path: [],
          },
        ],
      },
    });
  });

  it("fails parsing a number", () => {
    const result = schema().parse(42);
    expect(result).toEqual({
      success: false,
      error: {
        input: 42,
        schemaName: "string",
        issues: [{ schemaName: "string", input: 42, path: [] }],
      },
    });
  });
});
