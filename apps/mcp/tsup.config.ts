import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: ['esm'],
  outDir: 'dist',
  sourcemap: true,
  treeshake: true,
  outExtension: () => ({
    js: '.mjs',
  }),
  external: ['@polotrip/db'],
})
