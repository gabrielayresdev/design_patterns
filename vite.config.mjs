import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    coverage: { all: false },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/use-cases/**/*.spec.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          include: ["src/http/controllers/**/*.spec.ts"],
          environment:
            "./prisma/vitest-environment-prisma/prisma-test-environment.ts",
        },
      },
    ],
  },
});
