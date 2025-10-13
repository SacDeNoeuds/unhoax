/**
 * Utilities for every sized schemas like `x.array`, `x.setOf`, `x.mapOf` and `x.string`.
 */
export interface SizedSchemaRefiners {
  /**
   * @category Reference
   * @example min size, no description
   * ```ts
   * const sized = x.string.size({ min: 3 })
   * // or x.array(…), x.setOf(…), x.mapOf(…)
   * assert(sized.parse('hey').success === true)
   * ```
   * @example string min, max and description
   * ```ts
   * const description = 'short first name'
   * const schema = x.string.size({ min: 3, max: 5, description })
   * // or x.array(…), x.setOf(…), x.mapOf(…)
   *
   * assert(schema.parse('hey').success === true)
   * assert(schema.parse('he').success === false)
   * assert(schema.parse('hey yo').success === false)
   * assert(schema.refinements.size.description === description)
   * ```
   * @example basic array min/max
   * ```ts
   * const schema = x.array(x.number).size({ min: 1, max: 3 })
   * assert(schema.parse([1]).success === true)
   * assert(schema.parse([]).success === false)
   * assert(schema.parse([1, 2, 3, 4]).success === false)
   * ```
   * @example basic Set min/max
   * ```ts
   * const schema = x.setOf(x.number).size({ min: 1, max: 3 })
   * assert(schema.parse(new Set([1])).success === true)
   * assert(schema.parse(new Set()).success === false)
   * assert(schema.parse(new Set([1, 2, 3, 4])).success === false)
   * ```
   * @example basic Map min/max
   * ```ts
   * const schema = x.mapOf(x.number, x.number).size({ min: 1, max: 3 })
   * assert(schema.parse(new Map([[1, 1]])).success === true)
   * assert(schema.parse(new Map()).success === false)
   * assert(schema.parse(new Map([[1, 1], [2, 2], [3, 3], [4, 4]])).success === false)
   * ```
   * @example failure
   * ```ts
   * const sized = x.string.size({ min: 3 })
   *
   * assert(sized.parse('he').success === false)
   * assert.deepEqual(sized.parse('he').issues, [{
   *   schemaName: 'string',
   *   message: 'not a string (size)',
   *   path: [],
   *   refinement: 'size',
   *   input: 'he',
   * }])
   * ```
   */
  size(options: { min: number; max?: number; description?: string }): this
  /**
   * @category Reference
   * @example Max size, no description
   * ```ts
   * const sized = x.string.size({ max: 3 })
   * assert(sized.parse('hey').success === true)
   * assert(sized.parse('').success === true)
   * assert(sized.parse('heyo').success === false)
   * ```
   * @example failure
   * ```ts
   * const sized = x.string.size({ max: 3 })
   *
   * assert.deepEqual(sized.parse('heyo').issues, [{
   *   schemaName: 'string',
   *   message: 'not a string (size)',
   *   path: [],
   *   refinement: 'size',
   *   input: 'heyo',
   * }])
   * ```
   */
  size(options: { min?: number; max: number; description?: string }): this
}
