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
  'Map',
  'integer',
  'number',
  'object',
  'Typed',
  'record',
  'unknown',
  'Set',
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
    renames: {
      ...Object.assign(
        {},
        ...basicSchemas.map((schemaName) => ({
          [schemaName]: `x.${schemaName}`,
        })),
      ),
      Typed: 'x.typed',
    },
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
      SchemaRefiners: 'Schema',
      SizedSchemaRefiners: 'SizedSchema',
      StringSchemaRefiners: 'StringSchema',
      NumericSchemaRefiners: 'NumericSchema',
    },
    entryPoints: {
      './src/builder/SchemaRefiners.ts': {
        type: 'pick',
        exports: ['SchemaRefiners'],
      },
      './src/builder/string.ts': {
        type: 'pick',
        exports: ['StringSchemaRefiners'],
      },
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: ['NumericSchemaRefiners', 'SizedSchemaRefiners'],
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
