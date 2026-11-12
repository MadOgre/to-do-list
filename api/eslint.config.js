import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import { baseConfig } from "../eslint.config.base.js";

export default defineConfig([
  globalIgnores(["dist"]),
  baseConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
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
]);
