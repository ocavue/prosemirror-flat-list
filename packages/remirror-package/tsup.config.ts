import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts', 'src/style.css'],
  dts: { entry: 'src/index.ts' },
  splitting: false,
  sourcemap: false,
  clean: true,
})
