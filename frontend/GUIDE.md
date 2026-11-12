# to-do-list guide

The full reference: setup on every OS, the project layout and its conventions. For the short version, see [`README.md`](README.md).

A to-do list web app in React + TypeScript, built on Vite, with Mantine, React Router, React Query and axios. ESLint and TypeScript check the code in the editor, in the browser overlay while the dev server runs, and on the command line. SCSS and SCSS modules work out of the box.

The terms used here (Page, Shared Component, API Function, API Hook, Todo) are defined in [`CONTEXT.md`](CONTEXT.md). Every committed file is explained in [`FILES.md`](FILES.md).

## Run on your machine

You need **Node 22** and **pnpm** on your machine.

1. **Node 22.** The version is pinned in `.nvmrc` and in `engines` in `package.json`. Use a version manager that reads `.nvmrc`, such as [fnm](https://github.com/Schniz/fnm) (every OS), [nvm](https://github.com/nvm-sh/nvm) (macOS, Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows). Check with `node --version`: it should print `v22.22` or a later `v22`.
2. **pnpm, at the pinned version.** `packageManager` in `package.json` pins pnpm. Corepack, which ships with Node, runs exactly that version, but only once it's enabled. A globally installed pnpm ignores the pin and installs with its own version.
   - **Windows:** if pnpm is installed globally, remove it with `npm rm -g pnpm`. Then run `corepack enable` in a cmd opened as administrator, because Node's install folder needs admin rights.
   - **macOS and Linux:** run `corepack enable`, with `sudo` if Node is installed system-wide.
   - **Check:** `pnpm --version` in the project folder prints the pinned version.
3. Install and serve:

   ```sh
   pnpm install
   pnpm dev
   ```

   Open <http://localhost:9000>. The dev server listens on localhost only, so it isn't reachable from your network.

**One OS per checkout.** `node_modules` holds binaries built for one OS. If you run `pnpm install` in the same folder from Windows and from WSL (or any second OS), each install replaces the other's. Pick one OS for each checkout.

**Port 9000 is fixed.** If it's taken, `pnpm dev` stops with an error rather than moving to another port.

## Scripts

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
  theme.ts          the Mantine theme
  pages/            one folder per Page, e.g. pages/Home/Home.tsx + Home.module.scss
  components/       Shared Components (empty to start)
  api/              the shared axios instance and the API Functions
  apiHooks/         the API Hooks, built on React Query
  interfaces/       shared types, one file per type and the types derived from it
  styles/           global.scss, loaded once at startup, and _mantine.scss, Mantine's Sass helpers
```

- **Imports** use the `@/` alias for `src/`, for example `import { Home } from "@/pages"`.
- **Named exports only.** Lint rejects default exports, except in tool config files.
- **Barrels:** each area except `components` and `styles` has an `index.ts` that re-exports it. Give `components` one when you add the first Shared Component.
- **Components** are typed with `FC`, or `FC<ComponentNameProps>` when they take props.
- **Styles:** UI components come from Mantine. Custom styles go in SCSS modules, which can use Mantine's CSS variables and its Sass helpers under the `mantine` namespace, injected into every SCSS file: `mantine.rem(16px)`, `@include mantine.hover { … }`, `@include mantine.smaller-than(mantine.$mantine-breakpoint-md) { … }`. Mantine's docs examples use its PostCSS preset's syntax, so translate them to these forms. See ADR-0002.
- **Environment variables** go in `.env` (committed, with safe defaults) and are typed in `src/vite-env.d.ts`. Override them in `.env.local`, which is gitignored. `VITE_API_BASE_URL` sets the base URL of the shared axios instance.

### Local storage instead of an API

No backend exists yet, so the Todo API Functions keep the list in the browser's `localStorage`, through the demo-only helpers in `src/api/todoStorage.ts`. Each function keeps its real axios call commented out as a `REAL API` block above its `LOCAL STORAGE` block. When a real backend is ready, follow the switch steps in the comment at the top of `src/api/todos.ts`.

### Barrels and lazy-loaded routes

Barrels keep imports short, but they make it harder to load Pages on demand later. A Page that should be lazy-loaded must be imported directly from its own file, such as `@/pages/Home/Home`, and nowhere through the `@/pages` barrel. Otherwise it stays in the main bundle. At this size it doesn't matter, so all routes are loaded up front.

## Adding a backend

There is no backend folder yet. When you add one, put it next to `src/` at the repo root, for example in `server/`. Once the repo holds more than one package, consider pnpm workspaces. Then:
- point `VITE_API_BASE_URL` at it, or add a dev proxy in `vite.config.ts`;
- switch the Todo API Functions from `localStorage` to it (see [Local storage instead of an API](#local-storage-instead-of-an-api)).

## Origin

This project started from the [react-ts-starter](https://github.com/MadOgre/react-ts-starter) template at commit `bc028bf`. The template's planning record (intent, grilling rounds, spec and tickets) lives there under `docs/planning/starter-setup/`, for the reasoning behind the setup.
