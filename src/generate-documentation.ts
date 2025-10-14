import {
  generateReferenceMarkdown,
  type DocumentationExampleMapper,
} from 'heedoc'
import type { SchemaRefiners } from './builder/SchemaRefiners'

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
] as const

const advancedSchemas = [
  'coercedInteger',
  'coercedNumber',
  'fromGuard',
  'unsafeInteger',
  'unsafeNumber',
  'untrimmedString',
] as const

const schemaRefinersProperties: Record<keyof SchemaRefiners<any>, null> = {
  convertTo: null,
  guardAs: null,
  map: null,
  nullable: null,
  optional: null,
  recover: null,
  refine: null,
}
const propertiesToOmit = new Set([
  '~standard',
  ...Object.keys(schemaRefinersProperties),
  // ...Object.getOwnPropertyNames(x.unknown),
  // ...Object.getOwnPropertyNames(Object.getPrototypeOf(x.unknown)),
])

function mapNumericSchemaExample(
  propertyExampleTitleContains: string,
): DocumentationExampleMapper {
  return ({ code, title }, propertyName) => {
    if (!propertyName) return { code, title }
    const shouldKeep = title?.includes(propertyExampleTitleContains)
    return shouldKeep ? { code } : undefined
  }
}

function mapSizedSchemaExample(
  propertyExampleTitleContains: string,
): DocumentationExampleMapper {
  return ({ code, title }, propertyName) => {
    if (propertyName === 'defaultMaxSize' && title) return undefined

    if (propertyName !== 'size') return { code, title }
    return title?.includes(propertyExampleTitleContains) ? { code } : undefined
  }
}

Promise.all([
  generateReferenceMarkdown({
    output: './docs/schemas.md',
    mainHeading: 'Schemas',
    entryPoints: {
      './src/builder/main-barrel.ts': {
        exports: {
          type: 'pick',
          names: [
            ...basicSchemas,
            ...advancedSchemas,
            'ArraySchema',
            'MapSchema',
            'SetSchema',
          ],
        },
        propertiesToOmit,
        renames: {
          ...Object.assign(
            {},
            ...[...basicSchemas, ...advancedSchemas].map((schemaName) => ({
              [schemaName]: `x.${schemaName}`,
            })),
          ),
          Typed: 'x.typed',
          ArraySchema: 'x.array',
          MapSchema: 'x.Map',
          SetSchema: 'x.Set',
        },
        mapExample: {
          // numeric schemas
          'x.bigint': mapNumericSchemaExample('bigint'),
          'x.coercedInteger': mapNumericSchemaExample('number'),
          'x.coercedNumber': mapNumericSchemaExample('number'),
          'x.date': mapNumericSchemaExample('Date'),
          'x.integer': mapNumericSchemaExample('number'),
          'x.number': mapNumericSchemaExample('number'),
          'x.unsafeInteger': mapNumericSchemaExample('number'),
          'x.unsafeNumber': mapNumericSchemaExample('number'),
          // sized schemas
          'x.array': mapSizedSchemaExample('array'),
          'x.Map': mapSizedSchemaExample('Map'),
          'x.Set': mapSizedSchemaExample('Set'),
          // String schema
          'x.string': mapSizedSchemaExample('string'),
          'x.untrimmedString': mapSizedSchemaExample('string'),
        },
      },
    },
  }),
  generateReferenceMarkdown({
    output: './docs/utilities.md',
    startHeadingLevel: 1,
    // mainHeading: 'Utilities',
    entryPoints: {
      './src/builder/main-barrel.ts': {
        exports: {
          type: 'pick',
          names: ['SchemaRefiners'],
        },
        propertiesToOmit: new Set(['~standard']),
        renames: {
          SchemaRefiners: 'x.{anySchema}',
        },
      },
    },
  }),
]).then(
  () => console.debug('documentation generated ✅'),
  (err) => console.error('error generating documentation ❌', err),
)
