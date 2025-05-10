import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/http/server.ts', 'src/http/plugins/**/*.ts', 'src/http/routes/**/*.ts'],
  clean: true,
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: ['esm'],
  outDir: 'dist',
  sourcemap: true,
  treeshake: true,
  outExtension: () => ({
    js: `.mjs`,
  }),
  external: ['@polotrip/auth', '@polotrip/db', '@polotrip/transactional'],
});
