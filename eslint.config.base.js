import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import { Alphabet } from "eslint-plugin-perfectionist/alphabet";
import { defineConfig } from "eslint/config";

// The import order from CLAUDE.md's Code conventions: lowercase both names, then compare them character by character
// (by character code), so "eslint-plugin-x" sorts before "eslint/config".
const characterCodeAlphabet = Alphabet.generateCompleteAlphabet().sortByCharCodeAt().getCharacters();

// The rules for every package. Each package's eslint.config.js starts from this base and adds its own parser, globals and
// framework rules.
export const baseConfig = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [js.configs.recommended],
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
      // A space inside the braces of objects, destructuring and imports: { id, title }. Arrays stay ["a", "b"].
      "@stylistic/object-curly-spacing": ["error", "always"],
      "prefer-destructuring": ["error", { object: true, array: false }],
      // Arrow functions wherever possible.
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      // Four sections with a blank line between them: packages, the workspace packages (`@to-do-list/…`), the `@/`
      // alias, then relative files. Side-effect imports (`import "./styles.css";`) are sorted like any other import.
      "perfectionist/sort-imports": [
        "error",
        {
          customGroups: [{ groupName: "workspace", elementNamePattern: "^@to-do-list/" }],
          groups: [["builtin", "external"], "workspace", "internal", ["parent", "sibling", "index"], "unknown"],
          internalPattern: ["^@/"],
          sortSideEffects: true,
          newlinesBetween: 1,
        },
      ],
      // A blank line after the last import.
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
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
    // Tool config files may use default exports, because the tools require them.
    files: ["**/*.config.{js,mjs,cjs,ts}"],
    rules: { "no-restricted-syntax": "off" },
  },
]);
