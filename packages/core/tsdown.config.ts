import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    format: ['esm'],
    entry: ['src/index.ts', 'src/style.css'],
    target: 'chrome100',
    dts: { build: true, incremental: true },
    platform: 'browser',
  }
])
