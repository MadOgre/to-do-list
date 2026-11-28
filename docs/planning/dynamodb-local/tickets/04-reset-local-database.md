# 04 - Reset Local Database with `pnpm db:reset`, while DynamoDB Local runs

**Status:** todo
**Blocked by:** 03
**Model:** opus
**Skills:** None
**Pattern:** The reset, a `.ts` file in `api/dev/`: `api/dev/invoke.ts`: copy its header comment with a usage line, and how it runs (`node --env-file=.env` on a `.ts` file, from an `api/package.json` script); don't copy its Lambda handler and bundle code. The seed file, `api/dev/seeds/todos.ts`: `DEMO_TODOS` in `api/src/resources/todos/demo-todos.ts`: copy the six titles, their `completed` values, and their order; don't copy anything else, because `DEMO_TODOS` has no IDs and no Owner. The root reset command: `deploy:dev` in the root `package.json`: copy the call into the API with `pnpm --filter @to-do-list/api`; don't copy the build and the Terraform step. The docs: "First-time setup" in `docs/local-development.md`: copy the numbered steps.

## What to build

A developer runs `pnpm db:reset`, and the local todos table holds exactly the six Demo Todos again. The Home Page then shows them in the design's order. This ticket covers the case where `pnpm dev` already runs DynamoDB Local. A later ticket makes the reset start DynamoDB Local by itself.

- **The seed file:** one file for the todos table, `api/dev/seeds/todos.ts`. The file maps each Owner's ID to that Owner's Todos: `{ "demo-owner": [six Todos] }`. The six Demo Todos get fixed IDs in the UUIDv7 form. The IDs grow smaller down the list, because the list shows the largest ID first. Each seed row has `version` 1. `DEMO_TODOS` and its file go away, so the Lambda bundle no longer carries the Demo Todos.
- **The reset:** one small TypeScript file, `api/dev/reset-local-db.ts`, that `node` runs directly. The reset sends its requests with the AWS SDK that the API already has.
  - The reset always talks to DynamoDB Local on `localhost:8000`, with the fake credentials (access key `local`, secret `local`, region `local`), whatever `DATABASE` says.
  - The reset reads the table's name from `TODOS_TABLE` in `api/.env`.
  - The reset names the todos table in its code, with the keys `owner_id` and `todo_id`, and reads the seed file.
  - The reset deletes the local todos table if it exists, creates it again, and writes the seed rows.
  - On success, the reset prints `Reset tdl-dev-todos: 6 Todos written.`
- **The commands:** an API script runs the reset. The root `package.json` gets `db:reset`, which calls the API's script.
- **The docs:**
  - "First-time setup" in `docs/local-development.md` gets a step after the setup step: run `pnpm db:reset` once.
  - `README.md`: the "Quick start" runs `bin/setup-local-db.sh` and `pnpm db:reset` in place of `aws login`. "Prerequisites" names Java. "Scripts" gets `pnpm db:reset`.
  - `docs/adding-and-removing-resources.md` gets one row for the seed file in `api/dev/seeds/`, and one row for the lines in the reset.

## Seam under test

The running app, checked by hand: `pnpm dev`, `pnpm db:reset`, the browser and `curl`. These scenarios need a real DynamoDB Local, and no unit test runs against DynamoDB Local.

## Do not

- Don't send the reset's requests with `curl` in Bash, or with the AWS CLI.
- Don't make the reset generic, so that the reset reads every file in the seeds folder by itself. A later table adds about 10 lines to the reset.
- Don't put a subfolder for each table in the seeds folder, and don't use JSON seed files.
- Don't give the Demo Todos new UUIDv7 IDs on each reset. Each reset puts the same six IDs back.
- Don't let any step reach the dev table in AWS, even when `api/.env` selects `dev`. A seed of staging or production must never exist.
- Don't add a reset of the dev table. That reset is deferred.
- Don't add Seed data other than the six Demo Todos.
- The local table has the same keys as the real table, `owner_id` (partition key) and `todo_id` (sort key), both strings. The Demo Todos belong to the Demo Owner, `demo-owner` (Invariant 3).
- `pnpm dev` and the reset need no Bash (Invariant 7).

## Testing acceptance criteria

### Rules 1 to 3: the database setting

- [ ] **Local list**: given `DATABASE=local`, after a reset; then `GET /api/todos` returns the six Demo Todos.
- [ ] **Local create**: given `DATABASE=local`. The developer adds "Buy milk" on the Home Page; then "Buy milk" is in DynamoDB Local. The dev table in AWS has no "Buy milk".
- [ ] **Local, no AWS login**: given `DATABASE=local`, and no AWS credentials on the machine; then The dev server starts with no "Not logged in to AWS" line. Every route works.

### Rules 4 to 6: `pnpm dev`

- [ ] **Data kept**: given The developer adds "Buy milk", stops `pnpm dev`, and starts it again; then The list still has "Buy milk".

### Rules 7, 8 and 10: what the reset does

- [ ] **Reset after changes**: given The list has "Buy milk", and "Read for 1 hour" is deleted; then After the reset, the list has exactly the six Demo Todos, and no "Buy milk".
- [ ] **Reset twice**: given The developer runs the reset two times in a row; then The list has the same six Todos, with the same IDs, both times.
- [ ] **First reset**: given DynamoDB Local has no todos table; then The reset creates the table and writes the six Demo Todos.
- [ ] **Reset with dev selected**: given `DATABASE=dev`, and no AWS credentials; then The reset changes the local table only. The dev table in AWS is unchanged. No AWS error appears.
- [ ] **The order**: given After a reset, the developer opens the Home Page; then The list shows, from the top: "Complete online JavaScript course" (completed), "Jog around the park 3x", "10 minutes meditation", "Read for 1 hour", "Pick up groceries", "Complete Todo App on Frontend Mentor".

### Rule 9: the reset starts DynamoDB Local

- [ ] **Running**: given `pnpm dev` runs. The developer runs `pnpm db:reset`; then The reset prints only `Reset tdl-dev-todos: 6 Todos written.` DynamoDB Local keeps running.

## Acceptance criteria

- [ ] The reset never writes to AWS: the reset always uses DynamoDB Local's address on `localhost`, with fake credentials, and ignores `DATABASE` (the spec's Guarantee).
- [ ] The structure doc names the reset and the seed file, and no longer names the Demo Todos' old file.
- [ ] Every scenario above is a step in the closing manual check.
- [ ] The project's checks pass, as "Keep the build green" in the project's `CLAUDE.md` lists them.

## Notes

(Empty. `/forge:implement` adds notes here.)
