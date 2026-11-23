# api/: the Lambda API (`@to-do-list/api`)

A routing map for this package. Read a file only when this map points there. For a one-line note on each file, read the `api/` part of `docs/structure.md`.

**Status:** the API has one resource, todos, with all its routes (see `routes.json`). `POST /api/demo-todos/restore` is temporary, for the Restore Demo Todos link. The frontend still keeps its Todos in `localStorage` until it switches to the API.

## Request path

API Gateway HTTP API (`infra/modules/app/`) → `handler` in `src/index.ts` → the `RouteHandler` for `event.routeKey` → a `Result` (response, outcome, message) → one log line with the outcome.

- `routes.json` is the one route list. `src/index.ts` and `src/routes.ts` check it at startup, and Terraform makes one API Gateway route from each entry.
- `src/resource-handlers.ts` exports each handler under the name that `routes.json` uses.
- Locally, `dev/server.ts` (Express) plays API Gateway's part and calls the same `handler`. It reads `PORT` from `.env`.
- `pnpm build` writes `dist/index.mjs`. Terraform zips `dist/` and uploads it.

## Where to find

| Task | Go to |
| --- | --- |
| Add or remove a resource (routes, handlers, table, policy, env var, sample events, docs) | `docs/adding-and-removing-resources.md`: it lists every place, with templates |
| Handler, route and result types | `src/route-handler-types.ts` |
| Build a response, or a failed request's whole result | `src/response-builders.ts` |
| Read and check a JSON request body | `src/request-body.ts` (`readJsonBody`) |
| Outcome codes and the log format | `src/request-outcome-codes.ts` (its error codes come from `common/src/error-body.ts`), `docs/logging.md` |
| The shapes of the request, response and error bodies | `common/src/` (the package `@to-do-list/common`) |
| How the dev server differs from Lambda | `docs/local-development.md` |
| Run the built function with a sample event | `scripts/invoke.ts` (`pnpm invoke`), `sample-events/` |
