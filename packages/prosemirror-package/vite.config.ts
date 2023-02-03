import { defineConfig } from 'vite'

export default defineConfig(() => ({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup-vitest.ts'],
    coverage: {
      reporter: ['json', 'html'],
      all: true,
      src: ['./src'],
      exclude: ['**/*.spec.*'],
    },
    deps: {},
  },
}))
