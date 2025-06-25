import { generateReferenceMarkdown } from 'heedoc'

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

Promise.all([
  generateReferenceMarkdown({
    output: './docs/schemas.md',
    entryPoints: {
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: basicSchemas,
      },
    },
  }),
  generateReferenceMarkdown({
    output: './docs/advanced-schemas.md',
    entryPoints: {
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: advancedSchemas,
      },
    },
  }),
  generateReferenceMarkdown({
    output: './docs/reference.md',
    entryPoints: {
      './src/builder/main-barrel.ts': {
        type: 'pick',
        exports: [...basicSchemas, ...advancedSchemas],
      },
    },
  }),
]).then(
  () => console.debug('documentation generated ✅'),
  (err) => console.error('error generating documentation ❌', err),
)
