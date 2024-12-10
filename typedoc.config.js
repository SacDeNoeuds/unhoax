const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  basePath: isGithubActions ? './unhoax' : './docs',
  name: 'unhoax',
  entryPoints: ['./src/main.ts'],
  plugin: ['typedoc-unhoax-theme'],
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
}

export default config
