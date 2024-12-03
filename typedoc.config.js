/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ["./src/main.ts"],
  sortEntryPoints: false,
  out: "docs",
  excludeNotDocumented: true,
  excludeReferences: true,
  excludePrivate: true,
  excludeInternal: true,
  excludeExternals: true,
  excludeProtected: true,
  excludePrivate: true,
  includeVersion: true,
  searchInComments: true,
  searchInDocuments: true,
  navigation: {
    compactFolders: true,
    includeFolders: true,
    includeGroups: false,
    includeCategories: true,
    excludeReferences: true,
  },
  visibilityFilters: {},
  useFirstParagraphOfCommentAsSummary: true,
  categorizeByGroup: false,
  cleanOutputDir: true,
  customCss: "./guides/custom.css",
  projectDocuments: ["./guides/*.md"],
  groupOrder: ["Guide", "Parsing", "Schema", "*", "Schema Definition"],
  sort: ["documents-first", "alphabetical"],
};

export default config;
