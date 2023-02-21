import { execa } from 'execa'
import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: {
    'remirror-extension-flat-list': 'src/index.ts',
  },
  splitting: false,
  sourcemap: false,
  clean: false,
  onSuccess: async () => {
    await execa('pnpm', ['run', 'build:tsc'], { stdio: 'inherit' })
    await execa('pnpm', ['run', 'build:api-extractor'], { stdio: 'inherit' })
  },
})
