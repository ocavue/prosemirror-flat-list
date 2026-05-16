import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'remirror-extension-flat-list',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup-vitest.ts'],
  },
})
