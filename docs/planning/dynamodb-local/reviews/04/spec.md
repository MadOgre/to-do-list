# Spec review: ticket 04, Reset Local Database

Diff: commit c6d8861, against base 990a8f8. Checked against ticket 04, the spec and the rulings.

## Findings

None.

## What was checked

- **Seed file** (`api/dev/seeds/todos.ts:112-121`): `{ "demo-owner": [six Todos] }`, the six titles, their `completed` values and their order match the old `DEMO_TODOS`. The IDs are valid UUIDv7 forms (version nibble 7, variant 8). The IDs grow smaller down the list (`...0006...` to `...0001...`), and `listTodos` queries with `reverse: true`, so the list shows the design's order. Each row has `version: 1`.
- **`DEMO_TODOS` removed**: `api/src/resources/todos/demo-todos.ts` is deleted, and no file imports it.
- **Reset** (`api/dev/reset-local-db.ts`): it uses `dynamoDbClientConfig("local")`, a hard-coded `"local"`, so the endpoint is `http://localhost:8000` with access key, secret and region `local`, whatever `DATABASE` says. It reads `TODOS_TABLE`, names the keys `owner_id` (HASH) and `todo_id` (RANGE), both `S`. It ignores `ResourceNotFoundException` on delete (the "First reset" scenario), creates the table and writes the rows with the AWS SDK. It prints `Reset ${TODOS_TABLE}: 6 Todos written.` and nothing else. A thrown error exits with code 1. The `TodoEntity` has `entityAttribute: false` and `timestamps: false`, so raw `PutCommand` rows read back correctly. The reset is not generic, and it uses no `curl` and no AWS CLI.
- **Commands**: `api/package.json:12` runs `node --env-file=.env dev/reset-local-db.ts`. The root `package.json:16` calls it with `pnpm --filter @to-do-list/api`.
- **Docs**: the README has Java in "Prerequisites", the Quick start replaces `aws login` with the setup script and `pnpm db:reset`, and "Scripts" lists `pnpm db:reset`. `docs/local-development.md` has a new step 6. `docs/adding-and-removing-resources.md` has the two rows. `docs/structure.md` names the reset and the seed file, and no longer names `demo-todos.ts`.
- **Tests**: the ticket's seam is a manual check, and no criterion box is ticked. No unit test was added or needed, so no test is tautological and the seam has not drifted.

## Notes (not findings)

- `docs/local-development.md:180-184` adds a short "Reset Local Database" section. The ticket asked only for the setup step. The section is in scope as documentation of the new command, and the setup step links to it.
- The "closing manual check" criterion is in the ticket's uncommitted edits, not in the diff. This review did not judge it.
