import { fromGuard } from './from-guard'
import type { Schema } from './Schema'
import type { SizedSchemaRefiners } from './SizedSchemaRefiners'

export interface StringSchemaRefiners {
  /**
   * @category Reference
   * @see {@link string}
   * @example accepting only alpha letters
   * ```ts
   * const schema = x.string.pattern(/^[a-zA-Z]+$/)
   *
   * assert(schema.parse('abc').success === true)
   * assert(schema.parse('ab3').success === false)
   * ```
   */
  pattern(pattern: RegExp): this
}

export interface StringSchema
  extends Schema<{
      input: string
      output: string
      meta: {
        /**
         * Allows to configure the default max length of strings.
         *
         * The default value is intentionally low because safety-first.
         *
         * If you need to increase it, I recommend increasing it _locally_ at schema level:
         * `x.string.size({ max: 10_000 })`
         *
         * If you need to loosen it globally, use `x.string = x.untrimmedString.size({ max: 10_000 })`
         *
         * @category Config – Safety Guards
         * @default 1_000
         * @see {@link string}
         * @see {@link untrimmedString}
         *
         * @example change global max size
         * ```ts
         * x.string.defaultMaxSize = 20
         *
         * assert(x.string.parse('x'.repeat(20)).success === true)
         * assert(x.string.parse('x'.repeat(21)).success === false)
         * ```
         * @example override string default max length locally
         * ```ts
         * x.string.defaultMaxSize = 20
         * const schema = x.string.size({ min: 4, max: 25 })
         * assert(schema.parse('x'.repeat(24)).success === true)
         * ```
         *
         * @example it keeps max when applying min:
         * ```ts
         * x.string.defaultMaxSize = 20
         * const schema = x.string.size({ min: 3 })
         *
         * assert(schema.parse('x'.repeat(12)).success === true)
         *
         * assert(schema.parse('xx').success === false)
         * assert(schema.parse('x'.repeat(21)).success === false)
         * ```
         * @example the rule is **not** retro-active
         * ```ts
         * x.string.defaultMaxSize = 500
         * const schema = x.string.size({ min: 3 })
         *
         * assert(schema.parse('x'.repeat(21)).success === true)
         *
         * x.string.defaultMaxSize = 20
         * assert(schema.parse('x'.repeat(21)).success === true)
         * ```
         */
        defaultMaxSize: number
      }
    }>,
    StringSchemaRefiners,
    SizedSchemaRefiners {}

/**
 * @category Reference
 * @see {@link string} for a trimmed string.
 * @example const schema = x.untrimmedString
 * @example
 * ```ts
 * assert(x.untrimmedString.parse(' hello ').value === ' hello ')
 * ```
 */
export const untrimmedString = fromGuard(
  'string',
  (value) => typeof value === 'string',
) as unknown as StringSchema

let defaultMaxSize = 500
/**
 * This also trims the string. If you do not want this behavior,
 * explicitly use {@link untrimmedString}
 * @category Reference
 * @example
 * ```ts
 * assert(x.string.parse('  hello  ').value === 'hello')
 * ```
 */
export const string = untrimmedString
  .map((s) => s.trim())
  .size({ max: defaultMaxSize })

Object.defineProperty(string, 'defaultMaxSize', {
  get: () => defaultMaxSize,
  set: (max) => {
    defaultMaxSize = max
    string.refinements.size.max = max
  },
})
