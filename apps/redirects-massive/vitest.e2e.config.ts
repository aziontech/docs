import { defineConfig } from 'vitest/config'
import path from 'path'

// End-to-end tests that hit a REAL environment (production by default) to verify
// redirects actually work: old URL -> 301/302 -> new URL, and the destination
// loads. Network-bound and slow, so kept out of the unit/integration runs — run
// explicitly with `pnpm --filter redirects test:e2e`.
//
// Env:
//   REDIRECTS_BASE_URL  origin to test against (default https://www.azion.com)
//   E2E_ALL=1           test every redirect instead of a representative sample
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    maxConcurrency: 10
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
