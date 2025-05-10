import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/http/server.ts', 'src/http/plugins/**/*.ts', 'src/http/routes/**/*.ts'],
  clean: true,
  format: ['esm'],
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  treeshake: true,
  outExtension: () => ({
    js: `.mjs`,
  }),
  external: ['@polotrip/auth', '@polotrip/db', '@polotrip/transactional'],
});
