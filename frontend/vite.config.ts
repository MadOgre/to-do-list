import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// The absolute path of Mantine's Sass helpers, for the `@use` injected into every SCSS file below.
// Sass `@use` paths need forward slashes, so Windows backslashes are replaced.
const mantineSassHelpersPath = fileURLToPath(new URL("./src/styles/_mantine", import.meta.url)).replaceAll("\\", "/");

export default defineConfig({
  plugins: [
    react(),
    // Shows TypeScript and ESLint errors in the browser overlay during `pnpm dev`.
    checker({
      enableBuild: false,
      typescript: { buildMode: true },
      eslint: { lintCommand: "eslint .", useFlatConfig: true },
    }),
  ],
  server: {
    // The dev server stays private to this machine, out of reach from the network.
    host: "localhost",
    // A fixed, memorable port. Fail instead of silently moving to another one if it's taken.
    port: 9000,
    strictPort: true,
    // Requests to /api go to the API's dev server (api/dev/server.ts, PORT in api/.env), so the app calls the API
    // on its own origin. The path isn't rewritten: the API's routes start with /api too.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  build: {
    // Vite warns at 500 kB per minified chunk. The app is one Page that loads everything up front, so splitting
    // wouldn't speed up the first load; Mantine's Modal took the one chunk to about 540 kB (about 170 kB gzipped).
    // Lazy-load Pages by route once there's a second one, instead of raising this again.
    chunkSizeWarningLimit: 600,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Mantine's "Usage with Sass" setup: every SCSS file gets Mantine's helpers as the `mantine` namespace.
        // The guide's `api: "modern-compiler"` is left out: Vite 8 has no `api` option.
        additionalData: `@use "${mantineSassHelpersPath}" as mantine;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
