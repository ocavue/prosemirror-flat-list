import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: {
    'remirror-extension-flat-list': 'src/index.ts',
  },
  splitting: false,
  sourcemap: false,
  clean: false,
})
