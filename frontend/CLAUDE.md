# frontend/: the React app (`@to-do-list/frontend`)

A routing map for this package. Read a file only when this map points there. For the conventions, read `GUIDE.md`. For a one-line note on each file, read the `frontend/` part of `docs/structure.md`.

## Data flow

Page or Shared Component → API Hook (`src/apiHooks/todos.ts`, React Query, key `["todos"]`) → API Function (`src/api/todos.ts`) → `apiClient` (axios, base URL `VITE_API_BASE_URL` = `/api`) → Vite proxy → the API's dev server on port 3000.

- Every mutation invalidates `["todos"]` when it settles, whether it worked or failed, so the list refetches.
- A failed mutation shows a pop-up message from one place: the `MutationCache` in `src/queryClient.ts`. `src/api/errorText.ts` turns the API's error body into the text that people see. A failed read shows in the Page, through the query's `isError`.
- The Todo types come from `@to-do-list/common`, through `src/interfaces/Todo.ts`.
- Code marked Temporary (`restoreTodos`, `useRestoreTodos` and the Restore Demo Todos link) goes away together with `POST /api/demo-todos/restore`.

## Where to find

| Task | Go to |
| --- | --- |
| Providers (Mantine, notifications, modals, React Query, router) and the CSS load order | `src/main.tsx` |
| How a failed change is shown, and the text for each API error | `src/queryClient.ts`, `src/api/errorText.ts` |
| Add or change a route | `src/routes.tsx`, then `src/pages/<Name>/` and `src/pages/index.ts` |
| The to-do screen: filter state, counts, empty states, confirm dialogs, the load-error alert | `src/pages/Home/Home.tsx` |
| One UI piece (input, row, filters, footer, theme toggle) | `src/components/<Name>/<Name>.tsx` and its `.module.scss` |
| Todo and filter types | `src/interfaces/Todo.ts`, `src/interfaces/TodoFilter.ts` |
| Colors, font, radius, light and dark CSS variables | `src/theme/theme.ts` |
| Theme-wide overrides of Mantine components | `src/theme/theme.module.scss` |
| Sass helpers and breakpoints (they must match the theme) | `src/styles/_mantine.scss` |
| Design sizes and colors from Figma | `docs/planning/todo-list-mvp/design/FIGMA.md` and `STYLEGUIDE.md` |
| Dev server port, `/api` proxy, `@/` alias, Sass injection, chunk-size warning limit | `vite.config.ts` |

## Gotchas

- `src/main.tsx` imports Mantine's styles before ours on purpose. Keep that order.
- Import a lazy-loaded Page from its own file, never through the `@/pages` barrel.
- There is no test runner.
