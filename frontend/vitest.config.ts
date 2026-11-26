import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

// The tests reuse the app's Vite config, so the `@/` alias and the image imports work the same way as in the app.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // The test files: every *.test.ts and *.test.tsx in tests/, which has the same folders as src/.
      include: ["tests/**/*.test.{ts,tsx}"],
      // jsdom gives Node a browser's document and window, so components can render with no browser.
      environment: "jsdom",
      // Runs before each test file: the DOM matchers, the stubs for what jsdom lacks, and the cleanup.
      setupFiles: ["./tests/setup.ts"],
      // Each test starts with empty mocks: no calls left over from the test before it.
      clearMocks: true,
    },
  }),
);
