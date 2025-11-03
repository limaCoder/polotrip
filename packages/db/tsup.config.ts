import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/schema/index.ts", "src/models/index.ts"],
  clean: true,
  dts: true,
  format: ["esm"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  treeshake: true,
  outExtension: () => ({
    js: ".mjs",
  }),
});
