import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: { 'prosemirror-flat-list': 'src/index.ts', style: 'src/style.css' },
  splitting: false,
  sourcemap: false,
  clean: false,
})
