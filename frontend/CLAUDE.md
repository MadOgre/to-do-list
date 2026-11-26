# frontend/: the React app (`@to-do-list/frontend`)

A routing map for this package. Read a file only when this map points there. For the conventions, read `GUIDE.md`. For a one-line note on each file, read the `frontend/` part of `docs/structure.md`.

## Data flow

Page or Shared Component → API Hook (`src/api-hooks/todos.ts`, React Query, key `["todos"]`) → API Function (`src/api/todos.ts`) → `apiClient` (axios, base URL `VITE_API_BASE_URL` = `/api`) → Vite proxy → the API's dev server on port 3000.

- Every mutation invalidates `["todos"]` when it settles, whether it worked or failed, so the list refetches.
- A failed mutation shows a pop-up message from one place: the `MutationCache` in `src/query-client.ts`. `src/api/error-text.ts` turns the API's error body into the text that people see. A failed read shows in the Page, through the query's `isError`.
- The Todo types come from `@to-do-list/common`, through `src/types/todo.ts`.
- Code marked Temporary (`restoreDemoTodos`, `useRestoreDemoTodos` and the Restore Demo Todos link) goes away together with `POST /api/demo-todos/restore`.

## Where to find

| Task | Go to |
| --- | --- |
| Providers (Mantine, notifications, modals, React Query, router) and the CSS load order | `src/main.tsx` |
| How a failed change is shown, and the text for each API error | `src/query-client.ts`, `src/api/error-text.ts` |
| Add or change a route | `src/routes.tsx`, then `src/pages/<Name>/` and `src/pages/index.ts` |
| The to-do screen: filter state, counts, empty states, confirm dialogs, the load-error alert | `src/pages/Home/Home.tsx` |
| One UI piece (input, row, filters, footer, theme toggle, and the page layout that every Page shares: background, header, column width) | `src/components/<Name>/<Name>.tsx` and its `.module.scss` |
| Todo and filter types | `src/types/todo.ts`, `src/types/todo-filter.ts` |
| Colors, font, radius, light and dark CSS variables | `src/theme/theme.ts` |
| Theme-wide overrides of Mantine components | `src/theme/theme.module.scss` |
| Sass helpers and breakpoints (they must match the theme) | `src/styles/_mantine.scss` |
| Design sizes and colors from Figma | `docs/planning/todo-list-mvp/design/FIGMA.md` and `STYLEGUIDE.md` |
| Dev server port, `/api` proxy, `@/` alias, Sass injection, chunk-size warning limit | `vite.config.ts` |
| Unit tests: the config, the setup (jest-dom, cleanup, the `matchMedia` stand-in) and the `render` helper with `MantineProvider` | `vitest.config.ts`, `tests/setup.ts`, `tests/test-utils/render.tsx` |
| A component's or a function's tests | `tests/components/<Name>.test.tsx`, `tests/<area>/<file>.test.ts` |

## Gotchas

- `src/main.tsx` imports Mantine's styles before ours on purpose. Keep that order.
- Import a lazy-loaded Page from its own file, never through the `@/pages` barrel.
- Render a component in a test with `render` from `tests/test-utils/render.tsx`, never Testing Library's own `render`: Mantine's components need the provider.
- The tests import Vitest's functions (`describe`, `it`, `expect`, `vi`). They aren't global, so `tests/setup.ts` runs Testing Library's `cleanup` itself.
