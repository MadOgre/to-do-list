import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import { baseConfig } from "../eslint.config.base.js";

export default defineConfig([
  globalIgnores(["dist"]),
  baseConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Plain JS files (this config) aren't in any tsconfig, so skip type-aware rules for them.
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // Tool config files run in Node.
    files: ["**/*.config.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },
]);
