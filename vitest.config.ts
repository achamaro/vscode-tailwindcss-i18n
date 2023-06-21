import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["tests/**/*.{test,spec}.{js,ts}"],
  },
});
