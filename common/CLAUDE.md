# common/: the shared contract (`@to-do-list/common`)

A routing map for this package. For a one-line note on each file, read the `common/` part of `docs/structure.md`.

The zod schemas that `api/` and `frontend/` both import, and the types inferred from them. The package has no build:
`exports` in `package.json` points to `src/index.ts`, and esbuild, Vite and Node read the TypeScript as it is.

## Where to find

| Task | Go to |
| --- | --- |
| Everything the package exports | `src/index.ts` |
| The Todo, and the bodies of `POST` and `PATCH` | `src/todos.ts` |
| The error body, and the error outcome codes | `src/error-body.ts` |

## Gotchas

- Import the package's own files with the `.ts` extension (`./todos.ts`). Node runs them as they are.
- Use no Node or browser APIs here: both sides run this code. `tsconfig.json` loads no global types (`"types": []`),
  so `pnpm typecheck` catches them.
