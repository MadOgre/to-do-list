# 01 - Delete the Restore Demo Todos route, and hide the link

**Status:** done
**Blocked by:** None
**Model:** sonnet
**Skills:** `tdd` for writing the router test and the Home Page test first, at their seams
**Pattern:** `frontend/tests/components/TodoFooter.test.tsx` with `frontend/tests/test-utils/render.tsx`: copy how a test renders a component inside Mantine's provider and queries the screen; don't copy the component's own props, because the Home Page takes none and reads its data through the API Hooks. `api/tests/resources/todos/route-handlers/list-todos.test.ts`: copy the Vitest layout and the import style of the API's tests; don't copy the Repository mock, because the router test reads only the `routes` list.

## What to build

The route `POST /api/demo-todos/restore` goes away. A request to that route gets the same answer as any unknown route. The Home Page no longer shows the Restore Demo Todos link. The link stays in the Home Page's code, hidden with Mantine's `display="none"`, and with no `onClick`. A comment says that the link waits for a new use. The `restoreLink` class stays.

Delete every part that exists only for the route and the link, as the spec's "Deleting the route" lists them:

- In the API: the route's entry in the route list, the route handler `restoreDemoTodos` and its line in the handler registry, the Repository's `restoreDemoTodos`, and the Outcome `restored`.
- Also in the API: the route handler's test and the route's sample event.
- In the frontend: the API Function `restoreDemoTodos`, the API Hook `useRestoreDemoTodos`, and the Home Page's `confirmRestore` and its call of `useRestoreDemoTodos`.
- The text about the temporary route in the API's and the frontend's `CLAUDE.md`, and the lines about the route in the structure doc.

Keep `DEMO_TODOS` and its file. A later ticket moves the Demo Todos into the seed file.

## Seam under test

- **Rule 13:** the `routes` list that the API's routes module exports, in a new router test. The 404 itself comes from the dev server, so the closing manual check confirms the 404.
- **Rule 14:** the Home Page, rendered in a new frontend test. The frontend has no Home Page test yet, so this test is the first one.

## Do not

- Don't delete the Restore Demo Todos link or its `restoreLink` class. In the developer's words: "later that link will be repurposed, or at least its style".
- Don't keep the link's JSX as a comment. The link stays as code, with `display="none"`.
- Don't change any `.tf` file, and don't deploy. The developer runs `pnpm deploy:dev` later, and that deploy deletes the route from AWS.
- Keep the other routes, their responses and their Outcomes the same (Invariant 2).
- No unit test reaches DynamoDB (Invariant 6).

## Testing acceptance criteria

### Rules 13 and 14: the removed route and the hidden link

- [x] **Removed route**: given `POST http://localhost:3000/api/demo-todos/restore`; then 404 with `{"message":"Not Found"}`.
- [x] **Hidden link**: given The developer opens the Home Page; then The text "Restore demo todos" doesn't show.

## Acceptance criteria

- [x] A router test checks that the `routes` list has no `POST /api/demo-todos/restore` ("Verified another way").
- [x] A Home Page test checks that the text "Restore demo todos" isn't visible ("Verified another way").
- [x] The structure doc lists no deleted file, and names the new test files.
- [x] The project's checks pass, as "Keep the build green" in the project's `CLAUDE.md` lists them: `pnpm install`, `pnpm lint`, `pnpm build`, `pnpm test`, and a short `pnpm dev` start on ports 9000 and 3000.

## Notes

Base: 3623ab9d9e2475e7173f45c289ab1f92ef5213eb

Review (reviews/01/): no blocking findings. Spec review: no findings.
- S1 (judgment, new, `Home.tsx:106`): accepted as non-blocking. The ticket's "Do not" section keeps the hidden link for a later use, in the developer's words.
- Deferred: 0.

For the next builders:
- `DEMO_TODOS` is now used by nothing. It stays until the ticket that moves the Demo Todos into the seed file.
- `frontend/tests/test-utils/render.tsx` has no `QueryClientProvider`. `tests/pages/Home.test.tsx` wraps `Home` in its own provider, and mocks `@/api/api-client`.
- `todos-repository.ts` still imports `DeletePartitionCommand`, for `clearCompletedTodos`.
- `GLOSSARY.md` keeps `_Avoid_: restore`. `docs/code-audit/code-audit-2026-11-24.md` still names the route, as a dated audit.
