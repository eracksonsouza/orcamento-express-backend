import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,js}"],
    exclude: ["src/**/*.integration.{test,spec}.{ts,js}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.{test,spec}.ts", "src/**/index.ts"],
    },
  },
});
