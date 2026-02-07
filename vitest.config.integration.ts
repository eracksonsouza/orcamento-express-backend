import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@generated": path.resolve(__dirname, "./generated"),
    },
  },
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
