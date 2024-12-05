/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
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
  useFirstParagraphOfCommentAsSummary: true,
  categorizeByGroup: false,
  cleanOutputDir: true,
  groupOrder: [
    'Guide',
    'Parsing',
    'Schema',
    'Modifier',
    'Refinement',
    'Schema Definition',
    '*',
  ],
  sort: ['documents-first', 'alphabetical'],
}

export default config
