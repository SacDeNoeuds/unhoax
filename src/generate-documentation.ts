import { generateReferenceMarkdown } from 'heedoc'
import { x } from './builder/main'

const basicSchemas = [
  'array',
  'bigint',
  'boolean',
  'date',
  'Enum',
  'instanceOf',
  'literal',
  'mapOf',
  'integer',
  'number',
  'object',
  'record',
  'unknown',
  'setOf',
  'string',
  'tuple',
  'union',
  'variant',
]

const advancedSchemas = [
  'coercedInteger',
  'coercedNumber',
  'fromGuard',
  'unsafeInteger',
  'unsafeNumber',
  'untrimmedString',
]

const propertiesToOmit = new Set([
  ...Object.getOwnPropertyNames(x.unknown),
  ...Object.getOwnPropertyNames(Object.getPrototypeOf(x.unknown)),
])

Promise.all([
  generateReferenceMarkdown({
    output: './docs/schemas.md',
    mainHeading: 'Schemas',
    propertiesToOmit,
    entryPoints: {
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: basicSchemas,
      },
    },
  }),
  generateReferenceMarkdown({
    output: './docs/utilities.md',
    startHeadingLevel: 2,
    mainHeading: 'Utilities',
    propertiesToOmit: new Set(['~standard']),
    renames: {
      BaseBuilder: 'Schema',
      SizedBuilder: 'SizedSchema',
      NumericBuilder: 'NumericSchema',
      ObjectBuilder: 'x.object',
    },
    entryPoints: {
      './src/builder/Schema.ts': {
        type: 'pick',
        exports: ['BaseBuilder'],
      },
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: ['NumericBuilder', 'ObjectBuilder', 'SizedBuilder'],
      },
    },
  }),
  generateReferenceMarkdown({
    output: './docs/advanced-schemas.md',
    mainHeading: 'Advanced Schemas',
    propertiesToOmit,
    entryPoints: {
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: advancedSchemas,
      },
    },
  }),
]).then(
  () => console.debug('documentation generated ✅'),
  (err) => console.error('error generating documentation ❌', err),
)
