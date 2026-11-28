# 03 - Select the database with `DATABASE`

**Status:** todo
**Blocked by:** 02
**Model:** opus
**Skills:** `tdd` for writing the endpoint test first, at the new function
**Pattern:** `api/src/resources/todos/todos-repository.ts`, where it reads `TODOS_TABLE`: copy the check that throws when a required variable is missing; don't make any other change to the Repository than the client's settings. `api/dev/server.ts`, `NOT_LOGGED_IN_MESSAGE` and `isCredentialsError`: copy the check itself, which stays for `dev`; this part changes existing code only. "Settings" in `docs/local-development.md`: copy the table of variables; don't copy step 5, "Sign in to AWS", as a step that every developer needs.

## What to build

A developer chooses the database with one variable, `DATABASE`, in `api/.env`. With `local`, every todos route reads and writes DynamoDB Local, and the developer needs no AWS login. With `dev`, every todos route uses the real `tdl-dev-todos` table, as today. The deployed Lambda never gets `DATABASE`, and works as today.

- **The new function:** an exported function turns a `DATABASE` value into the DynamoDB client's settings. The Repository builds its client from the function's result.
  - With `local`, the function gives the endpoint `http://localhost:8000` and the fake credentials and region: access key `local`, secret `local`, region `local`.
  - For `dev`, no value or any other value, the function gives the settings of today. The function never throws.
  - `pnpm invoke` runs the Lambda's code, so `pnpm invoke` follows the same function, and doesn't refuse a missing or unknown `DATABASE`.
- **The dev server:** stops at startup unless `DATABASE` is `local` or `dev`, with `DATABASE must be local or dev (see api/.env.example)`. The refusal works like the missing `PORT` check of today: `nodemon` shows the error and waits, and the frontend and DynamoDB Local keep running. When the developer saves `api/.env` with a valid value, `nodemon` starts the server again.
- **The login check:** with `local`, the dev server skips the AWS credentials check and never prints `NOT_LOGGED_IN_MESSAGE`, also when a request fails. With `dev`, the check stays as today.
- **The settings:** `api/.env.example` sets `DATABASE=local`, with a comment. Later, staging and production can be more values of the same variable. The local table keeps the name in `TODOS_TABLE`, `tdl-dev-todos`.
- **The docs:** "Settings" in `docs/local-development.md` gets `DATABASE`. Step 5, "Sign in to AWS", becomes a step for `DATABASE=dev` only. "The API's dev server" no longer says that the todos routes always use the real table in AWS.

Before the first reset, the local table doesn't exist, so a todos route with `local` fails with a 500. A later ticket adds the reset.

## Seam under test

- **The endpoint:** the new exported function, in a new API test. The test checks the endpoint for `local`, `dev` and no value. For `local`, the test also checks the fake credentials and region.
- **Every other scenario:** the running app, checked by hand, with `pnpm dev`, the browser and `curl`.

## Do not

- Don't add a second root command for the dev table, such as `pnpm dev:aws`. One variable selects the database.
- Don't put the refusal in the Repository, and don't add `DATABASE` to the Lambda in Terraform. No `.tf` file changes (Invariant 8). A refusal in the API's own code would break every request to the Lambda.
- Don't treat a missing `DATABASE` as "use AWS" in the dev server. The developer rejected "missing means AWS" for the dev server.
- Don't give the local table a separate name.
- Don't add a variable for the port. The port is a fixed 8000.
- The deployed Lambda calls the real DynamoDB, as today (Invariant 1). The dev server listens on `localhost` only (Invariant 5).
- No unit test reaches DynamoDB (Invariant 6). The endpoint test doesn't mock the SDK's constructor.

## Testing acceptance criteria

### Rules 1 to 3: the database setting

- [ ] **Dev, logged in**: given `DATABASE=dev`, after `aws login`; then `GET /api/todos` returns the Todos in the real `tdl-dev-todos` table.
- [ ] **Dev, not logged in**: given `DATABASE=dev`, and no AWS credentials; then The dev server prints `NOT_LOGGED_IN_MESSAGE` at startup, as today.

### Rule 11: before the first reset

- [ ] **No table yet**: given DynamoDB Local runs, and no reset has run yet; then `GET /api/todos` answers 500 with `{"message":"Internal Server Error"}`. The terminal shows `ResourceNotFoundException`. The Home Page shows its red alert, "Could not load your todos."

### A missing or unknown database setting

- [ ] **Missing, dev server**: given No `DATABASE` in `api/.env`. The developer runs `pnpm dev`; then The dev server stops at startup with `DATABASE must be local or dev (see api/.env.example)`.
- [ ] **Unknown, dev server**: given `DATABASE=prod`, or any other value; then The dev server stops at startup with the same message.
- [ ] **Local**: given `DATABASE=local`; then The API uses DynamoDB Local.
- [ ] **Dev**: given `DATABASE=dev`; then The API uses the real DynamoDB in AWS.
- [ ] **Deployed Lambda**: given No `DATABASE`, as `infra/modules/app/main.tf` sets today; then The Lambda uses the real DynamoDB, as today.

## Acceptance criteria

- [ ] A test checks the endpoint that the DynamoDB client gets for each `DATABASE` value, including no value ("Verified another way").
- [ ] The structure doc names the new test file, and any new source file.
- [ ] Every scenario above, except the ones that the endpoint test covers, is a step in the closing manual check.
- [ ] The project's checks pass, as "Keep the build green" in the project's `CLAUDE.md` lists them. The short `pnpm dev` start needs `DATABASE` in `api/.env`.

## Notes

(Empty. `/forge:implement` adds notes here.)
