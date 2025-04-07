const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  basePath: isGithubActions ? './unhoax' : './docs',
  name: 'unhoax',
  entryPoints: ['./src/main-exports.ts'],
  plugin: ['typedoc-unhoax-theme'],
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
}

export default config
