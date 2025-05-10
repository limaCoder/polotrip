import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  clean: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  external: ['@polotrip/db'],
});
