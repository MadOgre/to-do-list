import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

import { baseConfig } from "../eslint.config.base.js";

export default defineConfig([
  baseConfig,
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
