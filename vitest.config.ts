import { defineConfig } from 'vitest/config'

const isCI = process.env.CI === 'true'

export default defineConfig({
  test: {
    coverage: {
      ...(isCI && { reporter: ['json-summary'] }),
      provider: 'istanbul',
      include: ['src'],
      exclude: [
        './src/main.ts',
        'src/generate-documentation.ts',
        '**/*.test.ts',
        '**/test-utils.ts',
      ],
    },
  },
})
