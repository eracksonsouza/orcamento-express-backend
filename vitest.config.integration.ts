import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.integration.{test,spec}.{ts,js}"],
    setupFiles: ["./src/test/setup/vitest-integration-setup.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
