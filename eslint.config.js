import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import { Alphabet } from "eslint-plugin-perfectionist/alphabet";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// The import order from CLAUDE.md's Code conventions: lowercase both names, then compare them character by character
// (by character code), so "eslint-plugin-x" sorts before "eslint/config".
const characterCodeAlphabet = Alphabet.generateCompleteAlphabet().sortByCharCodeAt().getCharacters();

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [
      js.configs.recommended,
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
    plugins: { "@stylistic": stylistic, perfectionist },
    settings: {
      perfectionist: { type: "custom", alphabet: characterCodeAlphabet, ignoreCase: true },
    },
    rules: {
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "prefer-destructuring": ["error", { object: true, array: false }],
      // Arrow functions wherever possible.
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      // Three sections with a blank line between them: packages, the `@/` alias, then relative files. Side-effect
      // imports (`import "./styles.css";`) are sorted like any other import.
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"], "unknown"],
          internalPattern: ["^@/"],
          sortSideEffects: true,
          newlinesBetween: 1,
        },
      ],
      "perfectionist/sort-named-imports": "error",
      "perfectionist/sort-exports": "error",
      "perfectionist/sort-named-exports": "error",
      // Named exports only, so barrels have a single name for each export.
      "no-restricted-syntax": [
        "error",
        { selector: "ExportDefaultDeclaration", message: "Use a named export." },
        { selector: "ExportSpecifier[exported.name='default']", message: "Use a named export." },
      ],
    },
  },
  {
    // Plain JS files (this config) aren't in any tsconfig, so skip type-aware rules for them.
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // Tool config files run in Node and may use default exports.
    files: ["**/*.config.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
    rules: { "no-restricted-syntax": "off" },
  },
]);
