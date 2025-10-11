import { defineConfig } from 'tsdown'

export default defineConfig({
  format: ['cjs', 'esm'],
  sourcemap: false,
  entry: { 'prosemirror-flat-list': 'src/index.ts', style: 'src/style.css' },
  dts: { build: true },
})
