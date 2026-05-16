import { defineConfig } from 'tsdown'

export default defineConfig([{
  format: ['cjs', 'esm'],
  entry: { 'prosemirror-flat-list': 'src/index.ts' },
  dts: { build: true, incremental: true },
  platform: 'neutral',
}, {
  entry:  [ 'src/style.css'],
  platform: 'browser',
  target: 'chrome100',
}])
