# Spec review: ticket 01, delete the Restore Demo Todos route and hide the link

Scope: commit 8d27f49, against the ticket `tickets/01-delete-restore-route-hide-link.md`. There are no rulings.

## Findings

None.

## What was checked

- **API deletions:** The diff removes the `routes.json` entry, the route handler `restore-demo-todos.ts` and its registry line. It also removes the Repository's `restoreDemoTodos`, the Outcome `restored`, the handler's test and the sample event. A search outside `docs/planning/` finds no reference that is left, except the new test, the structure doc's note about the new test, and the dated code audit. The diff keeps `DEMO_TODOS` and its file, as the ticket says. The spec deletes that file, but the ticket gives that work to a later ticket.
- **Repository imports:** `PutItemCommand`, `DeletePartitionCommand` and `Todo` are still used in `todos-repository.ts`, so the deletion leaves no unused import.
- **Frontend deletions:** The diff removes the API Function, the API Hook, `confirmRestore` and the hook call. `modals` and `Text` are still used in `Home.tsx` for the other confirm dialogs.
- **Link:** `frontend/src/pages/Home/Home.tsx:107` keeps the `Anchor` as code, not as a comment. The `Anchor` keeps its text and `classes.restoreLink`, has `display="none"`, and has no `onClick`. A comment says that the link waits for a new use.
- **Rule 13 seam:** `api/tests/router/routes.test.ts:7` reads the exported `routes` list and checks a literal method and path. This is the agreed seam. The ticket gives the 404 body to the closing manual check.
- **Rule 14 seam:** `frontend/tests/pages/Home.test.tsx:16` renders the Home Page through the project's `render`, mocks only the HTTP client, and checks the literal text "Restore demo todos" with `not.toBeVisible()`. The test is not tautological.
- **Testing acceptance criteria:** The boxes are not ticked, so no scenario test was due for audit. Both tests meet the criteria's Then at the agreed seams.
- **Docs:** `api/CLAUDE.md` and `frontend/CLAUDE.md` no longer have the text about the temporary route. `docs/structure.md` lists no deleted file. It names both new test files and changes "five mutations" to "four mutations".
- **Do not:** The diff changes no `.tf` file, and the other routes and Outcomes stay the same.
- **Scope creep:** None found.

The build checks (the last acceptance criterion) were not run. This review only reads the code.
