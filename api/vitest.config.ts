import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The test files: every *.test.ts in tests/, which has the same folders as src/.
    include: ["tests/**/*.test.ts"],
    // The API runs in Node, in Lambda and in the dev server, so the tests run in Node too.
    environment: "node",
    // Each test starts with empty mocks: no answer and no calls left over from the test before it.
    clearMocks: true,
  },
});
