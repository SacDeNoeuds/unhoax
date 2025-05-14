import type { Schema } from './Schema'

export type Sized =
  | { length: number; size?: undefined }
  | { size: number; length?: undefined }

export interface SizedBuilder<T extends Sized> {
  /**
   * @example Min size, no description
   * ```ts
   * const sized = x.string.size({ min: 3 })
   * assert(sized.parse('hey').success === true)
   * assert(sized.parse('he').success === false)
   * assert.deepEqual(sized.parse('he').issues, [{
   *   schemaName: 'string',
   *   message: 'not a string (size)',
   *   path: [],
   *   refinement: 'size',
   *   input: 'he',
   * }])
   * ```
   * @example Min, max and description
   * ```ts
   * const description = 'short first name'
   * const schema = x.string.size({ min: 3, max: 5, description })
   * assert(schema.parse('hey').success === true)
   * assert(schema.parse('he').success === false)
   * assert(schema.parse('hey yo').success === false)
   * assert(schema.refinements.size.description === description)
   */
  size(options: { min: number; max?: number; description?: string }): Schema<T>
  /**
   * @example Max size, no description
   * ```ts
   * const sized = x.string.size({ max: 3 })
   * assert(sized.parse('hey').success === true)
   * assert(sized.parse('heyo').success === false)
   * assert.deepEqual(sized.parse('heyo').issues, [{
   *   schemaName: 'string',
   *   message: 'not a string (size)',
   *   path: [],
   *   refinement: 'size',
   *   input: 'heyo',
   * }])
   * ```
   */
  size(options: { min?: number; max: number; description?: string }): Schema<T>
}
