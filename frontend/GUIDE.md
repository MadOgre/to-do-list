# Frontend guide

The frontend's conventions. To install and run the app, see [`docs/local-development.md`](../docs/local-development.md). For the short version, see the root [`README.md`](../README.md).

A to-do list web app in React + TypeScript, built on Vite, with Mantine, React Router, React Query and axios. ESLint and TypeScript check the code in the editor, in the browser overlay while the dev server runs, and on the command line. SCSS and SCSS modules work out of the box.

The terms used here (Page, Shared Component, API Function, API Hook, Todo) are defined in [`GLOSSARY.md`](../GLOSSARY.md). Every committed file is explained in [`docs/structure.md`](../docs/structure.md).

## Scripts

The frontend's own scripts are `dev`, `build`, `lint` and `preview`, in `package.json`. The root's scripts run them together with the API's: see the [Scripts](../README.md#scripts) table in the README. There is no test runner and no test script: add the testing setup you choose.

## Conventions

- **Imports** use the `@/` alias for `src/`, for example `import { Home } from "@/pages"`.
- **Named exports only.** Lint rejects default exports, except in tool config files.
- **Barrels:** each area except `styles` has an `index.ts` that re-exports it.
- **Components** are typed with `FC`, or `FC<ComponentNameProps>` when they take props.
- **Styles:** UI components come from Mantine. Custom styles go in SCSS modules, imported as `classes` (`import classes from "./Home.module.scss";`), as Mantine's docs do. They can use Mantine's CSS variables and its Sass helpers under the `mantine` namespace, injected into every SCSS file: `mantine.rem(16px)`, `@include mantine.hover { … }`, `@include mantine.smaller-than(mantine.$mantine-breakpoint-md) { … }`. Mantine's docs examples use its PostCSS preset's syntax, so translate them to these forms. See [ADR-0001](../docs/adr/0001-mantine-components-with-scss-modules.md).
- **Environment variables** go in `.env` (committed, with safe defaults) and are typed in `src/vite-env.d.ts`. Override them in `.env.local`, which is gitignored. `VITE_API_BASE_URL` sets the base URL of the shared axios instance.

### Errors from the API

The API Functions in `src/api/todos.ts` call the API through the shared axios instance. A failed change shows a red pop-up message from one place, the `MutationCache` in `src/queryClient.ts`. API Hooks and Pages don't show errors of changes. The text for each error code is in `src/api/errorText.ts`. When `common/` gets a new error code, the build fails until `ERROR_TEXTS` has a text for it.

### Barrels and lazy-loaded routes

Barrels keep imports short, but they make it harder to load Pages on demand later. A Page that should be lazy-loaded must be imported directly from its own file, such as `@/pages/Home/Home`, and nowhere through the `@/pages` barrel. Otherwise it stays in the main bundle. At this size it doesn't matter, so all routes are loaded up front.

## Origin

This project started from the [react-ts-starter](https://github.com/MadOgre/react-ts-starter) template at commit `bc028bf`. The template's planning record (intent, grilling rounds, spec and tickets) lives there under `docs/planning/starter-setup/`, for the reasoning behind the setup.
