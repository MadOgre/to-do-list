import { defineConfig, globalIgnores } from "eslint/config";

import { baseConfig } from "./eslint.config.base.js";

// The root's own files, such as eslint.config.base.js. Each package has its own eslint.config.js.
export default defineConfig([globalIgnores(["api", "common", "frontend"]), baseConfig]);
