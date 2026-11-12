# Frontend guide

The frontend's layout and conventions. To install and run the app, see [`docs/local-development.md`](../docs/local-development.md). For the short version, see the root [`README.md`](../README.md).

A to-do list web app in React + TypeScript, built on Vite, with Mantine, React Router, React Query and axios. ESLint and TypeScript check the code in the editor, in the browser overlay while the dev server runs, and on the command line. SCSS and SCSS modules work out of the box.

The terms used here (Page, Shared Component, API Function, API Hook, Todo) are defined in [`CONTEXT.md`](../CONTEXT.md). Every committed file is explained in [`docs/structure.md`](../docs/structure.md).

## Scripts

The frontend package's own scripts, run in `frontend/`. From the repo root, `pnpm dev`, `pnpm build` and `pnpm lint` run them together with the API's.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Serves the app at <http://localhost:9000> with HMR. TypeScript and ESLint errors show in the terminal and the browser overlay. |
| `pnpm build` | Type-checks, then builds for production into `dist/`. |
| `pnpm lint` | Runs ESLint over the project. |
| `pnpm preview` | Serves the production build from `dist/`. |

There is no test runner and no test script: add the testing setup you choose.

## Project layout

```
src/
  main.tsx          entry point: providers, router, Mantine and global styles
  routes.tsx        every route, in React Router's data mode
  queryClient.ts    the React Query client and its defaults
  theme.ts          the Mantine theme, with theme.module.scss for its component overrides
  pages/            one folder per Page, e.g. pages/Home/Home.tsx + Home.module.scss
  components/       Shared Components, one folder each, e.g. components/TodoRow/TodoRow.tsx + TodoRow.module.scss
  api/              the shared axios instance and the API Functions
  apiHooks/         the API Hooks, built on React Query
  images/           the design's background images and icons
  interfaces/       shared types, one file per type and the types derived from it
  styles/           global.scss, loaded once at startup, _mantine.scss, Mantine's Sass helpers, and _text-button.scss
```

- **Imports** use the `@/` alias for `src/`, for example `import { Home } from "@/pages"`.
- **Named exports only.** Lint rejects default exports, except in tool config files.
- **Barrels:** each area except `styles` has an `index.ts` that re-exports it.
- **Components** are typed with `FC`, or `FC<ComponentNameProps>` when they take props.
- **Styles:** UI components come from Mantine. Custom styles go in SCSS modules, which can use Mantine's CSS variables and its Sass helpers under the `mantine` namespace, injected into every SCSS file: `mantine.rem(16px)`, `@include mantine.hover { … }`, `@include mantine.smaller-than(mantine.$mantine-breakpoint-md) { … }`. Mantine's docs examples use its PostCSS preset's syntax, so translate them to these forms. See [ADR-0002](../docs/adr/0002-mantine-components-with-scss-modules.md).
- **Environment variables** go in `.env` (committed, with safe defaults) and are typed in `src/vite-env.d.ts`. Override them in `.env.local`, which is gitignored. `VITE_API_BASE_URL` sets the base URL of the shared axios instance.

### Local storage instead of an API

The API has no todos resource yet, so the Todo API Functions keep the list in the browser's `localStorage`, through the demo-only helpers in `src/api/todoStorage.ts`. Each function keeps its real axios call commented out as a `REAL API` block above its `LOCAL STORAGE` block. When the API's todos resource is ready, follow the switch steps in the comment at the top of `src/api/todos.ts`.

### Barrels and lazy-loaded routes

Barrels keep imports short, but they make it harder to load Pages on demand later. A Page that should be lazy-loaded must be imported directly from its own file, such as `@/pages/Home/Home`, and nowhere through the `@/pages` barrel. Otherwise it stays in the main bundle. At this size it doesn't matter, so all routes are loaded up front.

## Origin

This project started from the [react-ts-starter](https://github.com/MadOgre/react-ts-starter) template at commit `bc028bf`. The template's planning record (intent, grilling rounds, spec and tickets) lives there under `docs/planning/starter-setup/`, for the reasoning behind the setup.
