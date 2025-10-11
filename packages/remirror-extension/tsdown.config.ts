import { defineConfig } from 'tsdown'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: { 'remirror-extension-flat-list': 'src/index.ts' },
  dts: { build: true, incremental: true },
})
