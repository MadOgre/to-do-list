# 01: Todos stored in localStorage, shown on Home

**Status:** ready-for-agent

**Blocked by:** None (can start immediately)

**Spec:** `docs/planning/todo-list-mvp/spec.md`

**What to build:** The placeholder Item becomes the Todo, and the Todo's data access works end to end on top of `localStorage`. Opening `/` shows the six Demo Todos as simple Mantine rows (title, plus some sign of which is Completed). After the user's list is saved, `/` shows that list instead. If the stored data can't be read, Home shows "Could not load your todos." in a red alert. The API Functions keep their real axios calls commented out, and one comment says how to switch to a real API.

- [x] The Item interface is replaced by the Todo interface `{ id, title, completed }`, with `CreateTodoInput` = title only and `UpdateTodoInput` = a partial of everything except `id`, in the same file
- [x] The Item API Functions are replaced by `getTodos`, `getTodo`, `createTodo` (adds at the top, Active), `updateTodo`, `deleteTodo`, `clearCompletedTodos` (one request) and `restoreTodos`. All are `async` and return the types a real API would
- [x] Each API Function except `restoreTodos` has a commented-out "REAL API" block using `apiClient` (`GET /todos`, `GET /todos/:id`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`, `DELETE /todos?completed=true`), then a "LOCAL STORAGE" block. The `apiClient` import is commented out too
- [x] A concise comment at the top of the Todo API module lists the switch steps:
  1. Set `VITE_API_BASE_URL` in `.env.local`.
  2. Uncomment the import and the REAL API lines, and delete the LOCAL STORAGE lines.
  3. Delete the storage module, `restoreTodos`, its API Hook and the Restore Demo Todos link.
- [x] A storage module in the API area holds everything that exists only for `localStorage`: the storage key, the six Demo Todos (the design's titles and order, "Complete online JavaScript course" Completed), `readTodos` and `writeTodos`
- [x] `readTodos` returns the Demo Todos when nothing is stored, and otherwise the stored list as stored (an empty list stays empty). It throws when the stored data doesn't parse. The Demo Todos aren't written to storage until the first change
- [x] `restoreTodos` removes the stored key
- [x] The Item API Hooks are replaced by `useTodos`, `useTodo`, `useCreateTodo`, `useUpdateTodo`, `useDeleteTodo`, `useClearCompletedTodos` and `useRestoreTodos`. Every mutation invalidates the Todo list on success
- [x] The mock adapter module is deleted, with no artificial delay anywhere. `apiClient` and `VITE_API_BASE_URL` stay
- [x] Home reads the list from `useTodos()` and shows one row per Todo, keyed by `id`, using Mantine components. On a load error it shows a red Mantine `Alert` "Could not load your todos." No loading indicator is needed
- [x] No reference to Item remains in `src/`
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [x] Manual check on `/`:
  - With nothing stored, the six Demo Todos show.
  - Invalid JSON under the storage key in devtools shows the load-error alert after a reload.

## Comments

- 2026-10-05: The spec's function shape (`async` with no `await` in the LOCAL STORAGE block) fails lint: `@typescript-eslint/require-await`, plus `arrow-body-style` where a function only returns. The developer chose to drop `async` instead of disabling the rules: each API Function returns `Promise.resolve(...)` from its LOCAL STORAGE block, so the return types are unchanged, and switch step 2 says to make each function `async` again.
- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3. Code review (Standards + Spec) is clean after round 2. Round 1's fixes: FILES.md and `apiClient.ts` no longer say the API Functions use `apiClient` today, and the storage module gained `removeTodos()` so the storage key stays private to it. With invalid stored JSON, React Query's default 3 retries delay the load-error alert by about 7 seconds. The manual check on `/` is left to the developer.
- 2026-10-05: The developer did the manual check on `/`: the six Demo Todos show with nothing stored, and invalid JSON under the `todos` key shows the load-error alert after a reload. The alert took 5–10 seconds because of React Query's retries, so at the developer's request `useTodos` now sets `retry: false`, marked demo-only. Switch step 4 in `todos.ts` says to remove it.
- 2026-10-05: At the developer's request, `useTodo` sets `retry: false` too, so no Todo API Hook retries while the Todos live in `localStorage`. Mutations already don't retry by default. Switch step 4 now names both hooks.
