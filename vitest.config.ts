import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/test/",
        "eslint.config.js",
        "postcss.config.js",
        "tailwind.config.js",
        "vite.config.ts",
        "vitest.config.ts",
      ],
    },
  },
});
