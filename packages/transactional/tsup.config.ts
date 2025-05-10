import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['emails/welcome.tsx', 'emails/email-example.tsx'],
  clean: true,
  dts: true,
  format: ['esm'],
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  treeshake: true,
  outExtension: () => ({
    js: `.mjs`,
  }),
  external: ['react'],
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
});
