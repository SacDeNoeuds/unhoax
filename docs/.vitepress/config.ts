import { defineConfig, HeadConfig } from 'vitepress'

const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'unhoax',
  description: 'A standard schema library',
  head: [
    isGithubActions && [
      'script',
      {
        'data-goatcounter': 'https://sacdenoeuds.goatcounter.com/count',
        'async': 'true',
        'src': '//gc.zgo.at/count.js',
      },
    ],
  ].filter(Boolean) as HeadConfig[],
  base: isGithubActions ? '/unhoax/' : undefined,
  outDir: './dist',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Reference', link: '/reference' },
    ],
    sidebar: [
      { text: 'Getting started', link: '/' },
      { text: 'Schemas', link: '/schemas' },
      { text: 'Advanced schemas', link: '/advanced-schemas' },
      { text: 'Reference', link: '/reference' },
      { text: 'Why yet-another', link: '/why-yet-another' },
      { text: 'Why coercion instead of codec', link: '/why-coercion' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SacDeNoeuds/unhoax' },
    ],
  },
})
