import { defineConfig } from 'vitest/config'

const isCI = process.env.CI === 'true'

export default defineConfig({
  test: {
    include: ['./src/(builder|common)/*.(spec|test).ts'],
    coverage: {
      ...(isCI && { reporter: ['json-summary'] }),
      provider: 'istanbul',
      include: ['src/builder', 'src/common'],
      exclude: ['**/*.test.ts', '**/test-utils.ts'],
    },
  },
})
