/// <reference types="vitest/config" />
import { playwright } from '@vitest/browser-playwright'
import { playwrightCommands } from 'vitest-browser-commands'
import { defineProject } from 'vitest/config'

export default defineProject({
  plugins: [playwrightCommands()],
  test: {
    name: 'prosemirror-flat-list',
    globals: true,
    fileParallelism: false,
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
    },
  },
})
