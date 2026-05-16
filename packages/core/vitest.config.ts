/// <reference types="vitest/config" />
import { playwright } from '@vitest/browser-playwright'
import { defineProject } from 'vitest/config'
import { playwrightCommands } from 'vitest-browser-commands'

export default defineProject({
  plugins: [playwrightCommands()],
  test: {
    name: 'prosemirror-flat-list',
    setupFiles: ['./test/setup-vitest.ts'],
    globals: true,
    browser: {
      enabled: true,
      provider: playwright({
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
          reducedMotion: 'reduce',
        },
      }),
      headless: !process.env.DEBUG,
      instances: [{ browser: 'chromium' }],
      fileParallelism: true,
    },
  },
})
