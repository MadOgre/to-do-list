# frontend/: the React app (`@to-do-list/frontend`)

A routing map for this package. Read a file only when this map points there. For the conventions, read `GUIDE.md`. For a one-line note on each file, read the `frontend/` part of `docs/structure.md`.

## Data flow

Page or Shared Component → API Hook (`src/apiHooks/todos.ts`, React Query, key `["todos"]`) → API Function (`src/api/todos.ts`) → `localStorage`, through `src/api/todoStorage.ts`.

- Every mutation invalidates `["todos"]`, so the list refetches.
- The real API path is in the code but commented out: `apiClient` (axios, base URL `VITE_API_BASE_URL` = `/api`) → Vite proxy → the API's dev server on port 3000. The switch steps are in the comment at the top of `src/api/todos.ts`.
- Code marked `DEMO ONLY`, `LOCAL STORAGE` or Restore Demo Todos goes away at that switch. Keep the `REAL API` blocks in step with it.

## Where to find

| Task | Go to |
| --- | --- |
| Providers (Mantine, modals, React Query, router) and the CSS load order | `src/main.tsx` |
| Add or change a route | `src/routes.tsx`, then `src/pages/<Name>/` and `src/pages/index.ts` |
| The to-do screen: filter state, counts, empty states, confirm dialogs, error alerts | `src/pages/Home/Home.tsx` |
| One UI piece (input, row, filters, footer, theme toggle) | `src/components/<Name>/<Name>.tsx` and its `.module.scss` |
| Todo and filter types | `src/interfaces/Todo.ts`, `src/interfaces/TodoFilter.ts` |
| Colors, font, radius, light and dark CSS variables | `src/theme.ts` |
| Theme-wide overrides of Mantine components | `src/theme.module.scss` |
| Sass helpers and breakpoints (they must match the theme) | `src/styles/_mantine.scss` |
| Design sizes and colors from Figma | `docs/planning/todo-list-mvp/design/FIGMA.md` and `STYLEGUIDE.md` |
| Dev server port, `/api` proxy, `@/` alias, Sass injection | `vite.config.ts` |

## Gotchas

- `src/main.tsx` imports Mantine's styles before ours on purpose. Keep that order.
- Import a lazy-loaded Page from its own file, never through the `@/pages` barrel.
- There is no test runner.
