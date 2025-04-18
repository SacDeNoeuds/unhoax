/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: 'unhoax',
  entryPoints: ['./src/main-exports.ts'],
  // plugin: ['typedoc-unhoax-theme'],
  plugin: ['typedoc-plugin-markdown', 'typedoc-vitepress-theme'],
  navigationLinks: {
    GitHub: 'https://github.com/SacDeNoeuds/unhoax',
  },
  out: 'docs',
  includeVersion: true,
  searchInComments: true,
  searchInDocuments: true,
  categorizeByGroup: false,
  navigation: {
    compactFolders: true,
    includeCategories: true,
    excludeReferences: true,
    includeGroups: false,
  },
  visibilityFilters: {},
  defaultCategory: 'Default Category',
  cleanOutputDir: true,
  excludeCategories: ['Default Category'],
  categoryOrder: [
    'Guide',
    'Parsing',
    'Schema',
    'Unsafe Schema',
    'Refinement',
    'Modifier',
    'Schema Definition',
    'Advanced Usage / Core',
    '*',
  ],
  sort: ['documents-first', 'alphabetical'],
  customJs: './typedoc-analytics.js',
  // vitepress theme
  docsRoot: './guides',
  indexFormat: 'table',
  useCodeBlocks: true,
  disableSources: true,
}

export default config
