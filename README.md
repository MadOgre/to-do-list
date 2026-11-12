# to-do-list

A to-do list web app in React + TypeScript on Vite, with Mantine, React Router, React Query, axios, SCSS and ESLint.

For every detail, see **[GUIDE.md](GUIDE.md)**.

## Prerequisites

- **Node 22.22 or later 22.x.** It's pinned in `.nvmrc`, so [fnm](https://github.com/Schniz/fnm) or nvm picks it up.
- **pnpm through corepack.** Run `corepack enable` once. On Windows, remove any global pnpm first (`npm rm -g pnpm`), then run `corepack enable` in an admin prompt.

## Quick start

```sh
git clone <repo-url> to-do-list
cd to-do-list
pnpm install
pnpm dev
```

Open **<http://localhost:9000>**.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Serves with HMR, and shows lint and type errors in the browser |
| `pnpm build` | Type-checks, then builds into `dist/` |
| `pnpm lint` | Runs ESLint |
| `pnpm preview` | Serves the production build |

## Caveats

- **Port 9000 is fixed.** If it's taken, `pnpm dev` stops with an error rather than moving to another port.
- **One OS per checkout.** `node_modules` holds binaries for a single OS, so don't install from both Windows and WSL in the same folder.

## More

- [GUIDE.md](GUIDE.md): full setup, project layout, where the project came from
- [FILES.md](FILES.md): what every file is for
- [CONTEXT.md](CONTEXT.md): the project's terms
