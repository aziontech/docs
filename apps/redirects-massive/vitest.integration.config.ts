import { defineConfig } from 'vitest/config'
import path from 'path'

// Integration tests config - runs only integration tests.
// These exercise the full handler and validate the 301 responses end-to-end.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    include: ['tests/integration/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/**', '.edge/', 'azion/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
