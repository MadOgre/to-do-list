# api/: the Lambda API (`@to-do-list/api`)

A routing map for this package. Read a file only when this map points there. For a one-line note on each file, read the `api/` part of `docs/structure.md`.

**Status:** the API has one resource, todos, with all its routes (see `routes.json`). The frontend reads and changes its Todos through these routes.

## Request path

API Gateway HTTP API (`infra/modules/app/`) → `handler` in `src/index.ts`, which is the router in `src/router/router.ts` → the `RouteHandler` for `event.routeKey` → a `Result` (response, outcome, message) → one log line with the outcome.

- `routes.json` is the one route list. `src/router/router.ts` and `src/router/routes.ts` check it at startup, and Terraform makes one API Gateway route from each entry.
- `src/router/handler-registry.ts` exports each route handler under the name that `routes.json` uses. The route handlers are in `src/resources/<resource>/route-handlers/`, one file per route, named after the route handler.
- Locally, `dev/server.ts` (Express) plays API Gateway's part and calls the same `handler`. It reads `PORT` from `.env`.
- `pnpm build` writes `dist/index.mjs`. Terraform zips `dist/` and uploads it.
- `pnpm test` runs the unit tests in `tests/` (Vitest, `vitest.config.ts`). `tests/` has the same folders as `src/`. A route handler's test replaces the repository with `vi.mock` and builds its event with `makeEvent` from `tests/fixtures/events.ts`, so no test reaches DynamoDB.

## Where to find

| Task | Go to |
| --- | --- |
| Add or remove a resource (routes, handlers, table, policy, env var, sample events, docs) | `docs/adding-and-removing-resources.md`: it lists every place, with templates |
| The route handler and result types | `src/route-handler-tools/route-handler.ts` |
| The method type, and the startup check of `routes.json` | `src/router/routes.ts` |
| Build a response, or a failed request's whole result | `src/route-handler-tools/responses.ts` |
| Read and check a JSON request body | `src/route-handler-tools/json-body.ts` (`readJsonBody`) |
| Outcome codes and the log format | `src/route-handler-tools/outcome-codes.ts` (its error codes come from `common/src/error-body.ts`), `docs/logging.md` |
| The shapes of the request, response and error bodies | `common/src/` (the package `@to-do-list/common`) |
| How the dev server differs from Lambda | `docs/local-development.md` |
| Run the built function with a sample event | `dev/invoke.ts` (`pnpm invoke`), `dev/sample-events/` |
| Test a route handler | `tests/resources/<resource>/route-handlers/<name>.test.ts`, with `tests/fixtures/events.ts` |
