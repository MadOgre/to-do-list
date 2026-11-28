# Spec: DynamoDB Local

## Scope

A developer runs the whole app with `pnpm dev` against DynamoDB Local on their own machine. The table starts with the Demo Todos. The developer needs no AWS account, no `aws login` and no AWS CLI.

The smallest useful version:

1. A small Bash script in the root `bin/` folder installs Java and DynamoDB Local, if they are missing. Git ignores the DynamoDB Local download. No `package.json` script runs the setup script.
2. `pnpm dev` starts DynamoDB Local.
3. A seed step creates the todos table and fills it with the Demo Todos. The step is TypeScript with the AWS SDK, not the AWS CLI.
4. A setting in `api/.env` sends the API's DynamoDB calls to DynamoDB Local. Locally, the setting is on by default.
5. `docs/local-development.md` explains the setup, and no longer needs `aws login` for local work.
6. A command in the root `package.json` resets and reseeds the local database only.
7. The developer can select `dev`. Then the API uses the real dev table in AWS.
8. The feature deletes the route `POST /api/demo-todos/restore` and the code that only the route uses. The feature hides the Restore Demo Todos link on the Home Page. The Demo Todos exist only as the Seed of the local database.

Out of scope:

- The parameter to choose the staging or production database. The feature only keeps room for it.
- DynamoDB Local in Docker.
- Changes to Terraform, and any deploy to AWS. The route deletion changes `api/routes.json`, so the next `pnpm deploy:dev` deletes the route from AWS. The developer runs that deploy.
- Tests that run against DynamoDB Local. The unit tests keep mocking the Repository.
- Seed data other than the six Demo Todos.

## Behavior

The developer accepted these 14 rules as right and complete. Each group of rules has one scenario table.

### Rules 1 to 3: the database setting

1. With the database setting `local`, every todos route reads and writes DynamoDB Local. Why: the developer needs no AWS account.
2. With `local`, the dev server never mentions `aws login`. With `dev`, the login check works as today. Why: a message about AWS is noise when AWS isn't used.
3. With `dev`, every todos route reads and writes the real `tdl-dev-todos` table, with the `aws login` credentials. Why: the dev table stays available for testing.

| Scenario | Given | Then |
| --- | --- | --- |
| Local list | `DATABASE=local`, after a reset | `GET /api/todos` returns the six Demo Todos |
| Local create | `DATABASE=local`. The developer adds "Buy milk" on the Home Page | "Buy milk" is in DynamoDB Local. The dev table in AWS has no "Buy milk" |
| Local, no AWS login | `DATABASE=local`, and no AWS credentials on the machine | The dev server starts with no "Not logged in to AWS" line. Every route works |
| Dev, logged in | `DATABASE=dev`, after `aws login` | `GET /api/todos` returns the Todos in the real `tdl-dev-todos` table |
| Dev, not logged in | `DATABASE=dev`, and no AWS credentials | The dev server prints `NOT_LOGGED_IN_MESSAGE` at startup, as today |

Also checked, nothing to decide: two developers at once, old data.

### Rules 4 to 6: `pnpm dev`

4. `pnpm dev` starts DynamoDB Local next to the frontend and the API, with either setting. Ctrl+C stops all three. Why: one command runs the whole app.
5. If DynamoDB Local fails to start, the frontend and the API keep running, and the terminal shows DynamoDB Local's error. Why: with `dev`, the developer can still work.
6. The local Todos survive a stop and a start of `pnpm dev`. Why: test data isn't lost.

| Scenario | Given | Then |
| --- | --- | --- |
| Start | DynamoDB Local is installed. The developer runs `pnpm dev` | The terminal shows the frontend on 9000, the API on 3000, and DynamoDB Local on 8000 |
| Stop | `pnpm dev` runs. The developer presses Ctrl+C | All three stop. Ports 9000, 3000 and 8000 are free |
| Not installed | DynamoDB Local's folder is missing. The developer runs `pnpm dev` | The terminal shows Java's error, `Unable to access jarfile …`. The frontend and the API keep running |
| Port taken | Another program uses port 8000. The developer runs `pnpm dev` | The terminal shows DynamoDB Local's error, except on WSL 1: there, DynamoDB Local can start and print no error. The frontend and the API keep running |
| Data kept | The developer adds "Buy milk", stops `pnpm dev`, and starts it again | The list still has "Buy milk" |

Also checked, nothing to decide: `DATABASE=dev` with DynamoDB Local running, Windows itself, a foreign program on port 8000. With a foreign program on port 8000, the API's requests fail with a 500, and the reset fails and exits with code 1. The developer frees the port.

### Rules 7, 8 and 10: what the reset does

7. The reset deletes the local todos table if it exists, and creates it with the keys `owner_id` and `todo_id`. Then the reset writes the seed rows, with the same six IDs each time. Why: a known start for every test.
8. The reset always talks to DynamoDB Local on `localhost`, with fake credentials, whatever the database setting says. Why: the reset can't change AWS by accident.
10. After a reset, the Home Page shows the six Demo Todos in the design's order, with "Complete online JavaScript course" first and completed. Why: the list matches the design.

| Scenario | Given | Then |
| --- | --- | --- |
| Reset after changes | The list has "Buy milk", and "Read for 1 hour" is deleted | After the reset, the list has exactly the six Demo Todos, and no "Buy milk" |
| Reset twice | The developer runs the reset two times in a row | The list has the same six Todos, with the same IDs, both times |
| First reset | DynamoDB Local has no todos table | The reset creates the table and writes the six Demo Todos |
| Reset with dev selected | `DATABASE=dev`, and no AWS credentials | The reset changes the local table only. The dev table in AWS is unchanged. No AWS error appears |
| The order | After a reset, the developer opens the Home Page | The list shows, from the top: "Complete online JavaScript course" (completed), "Jog around the park 3x", "10 minutes meditation", "Read for 1 hour", "Pick up groceries", "Complete Todo App on Frontend Mentor" |

Also checked, nothing to decide: the reset while the Home Page is open, another Owner's Todos.

### Rule 9: the reset starts DynamoDB Local

9. If DynamoDB Local isn't running, the reset starts it, waits, resets the table, and stops it. If DynamoDB Local runs already, the reset uses it and leaves it running. The reset prints a short message for each step. Why: the reset works whether `pnpm dev` runs or not.

| Scenario | Given | Then |
| --- | --- | --- |
| Not running | `pnpm dev` is stopped. The developer runs `pnpm db:reset` | The reset prints `DynamoDB Local isn't running. Starting it…`, then `Reset tdl-dev-todos: 6 Todos written.`, then `Stopped DynamoDB Local.` Port 8000 is free afterward |
| Running | `pnpm dev` runs. The developer runs `pnpm db:reset` | The reset prints only `Reset tdl-dev-todos: 6 Todos written.`, after pnpm's own `>` lines. DynamoDB Local keeps running |
| Can't start | DynamoDB Local isn't installed. The developer runs `pnpm db:reset` | After 10 seconds, the reset prints `DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh? See docs/local-development.md.` and exits with code 1. Nothing changes |

Also checked, nothing to decide: Ctrl+C during the reset.

### Rule 11: before the first reset

11. Before the first reset, the local table doesn't exist, and a todos route fails with a 500. The docs tell the developer to run the reset once after the install. Why: the least code, for a case that happens once per machine.

| Scenario | Given | Then |
| --- | --- | --- |
| No table yet | DynamoDB Local runs, and no reset has run yet | `GET /api/todos` answers 500 with `{"message":"Internal Server Error"}`. The terminal shows `ResourceNotFoundException`. The Home Page shows its red alert, "Could not load your todos." |

The reminder to run the setup is in the docs only. "First-time setup" in `docs/local-development.md` gets two new steps after `pnpm install`: run `bin/setup-local-db.sh` (or the manual steps), then run `pnpm db:reset` once.

### Rule 12: the setup script

12. The setup script installs Java with `apt` if `java` isn't found, and downloads and unpacks DynamoDB Local if it isn't there. A second run is harmless. Why: one script for the one-time install.

| Scenario | Given | Then |
| --- | --- | --- |
| Fresh machine | No Java and no DynamoDB Local | The script asks for the `sudo` password, installs Java, then downloads and unpacks DynamoDB Local. The script prints `Installing Java...`, `Downloading DynamoDB Local...` and `DynamoDB Local is installed in api/.dynamodb-local/.` |
| Java already there | Java is installed, DynamoDB Local isn't | The script only downloads and unpacks DynamoDB Local. The script prints `Downloading DynamoDB Local...` and `DynamoDB Local is installed in api/.dynamodb-local/.` |
| Both there | Java and DynamoDB Local are installed | The script prints `Java and DynamoDB Local are installed.` and changes nothing |

Also checked, nothing to decide: an old Java version, a failed download.

### Rules 13 and 14: the removed route and the hidden link

13. `POST /api/demo-todos/restore` answers like any unknown route: 404 with `{"message":"Not Found"}`. Why: the route is gone.
14. The Restore Demo Todos link isn't visible on the Home Page. Why: the link waits for a new use.

| Scenario | Given | Then |
| --- | --- | --- |
| Removed route | `POST http://localhost:3000/api/demo-todos/restore` | 404 with `{"message":"Not Found"}` |
| Hidden link | The developer opens the Home Page | The text "Restore demo todos" doesn't show |

### A missing or unknown database setting

The developer rejected "missing means AWS" for the dev server. The deployed Lambda never gets `DATABASE`, so only the dev server refuses.

| Scenario | Given | Then |
| --- | --- | --- |
| Missing, dev server | No `DATABASE` in `api/.env`. The developer runs `pnpm dev` | The dev server stops at startup with `DATABASE must be local or dev (see api/.env.example)` |
| Unknown, dev server | `DATABASE=prod`, or any other value | The dev server stops at startup with the same message |
| Local | `DATABASE=local` | The API uses DynamoDB Local |
| Dev | `DATABASE=dev` | The API uses the real DynamoDB in AWS |
| Deployed Lambda | No `DATABASE`, as `infra/modules/app/main.tf` sets today | The Lambda uses the real DynamoDB, as today |

### Verified another way

- **Automated tests:** the hidden link (a Home Page test) and the removed route (a router test). Another test checks the endpoint that the DynamoDB client gets for each `DATABASE` value, including no value.
- **Manual checks:** every other scenario in rules 1 to 12, as steps in the feature's closing check. No unit test runs against DynamoDB Local.

### Guarantees

- **The reset never writes to AWS.** Ensured by: the reset always uses DynamoDB Local's address on `localhost`, with fake credentials, and ignores `DATABASE`. If broken: trusted, no handling.

## Invariants

1. The deployed Lambda calls the real DynamoDB, as today. Source: `api/src/resources/todos/todos-repository.ts`.
2. The routes, their responses and their outcomes stay the same, except that the feature deletes `POST /api/demo-todos/restore`. Source: `api/routes.json`.
3. The local table has the same keys as the real table: `owner_id` (partition key) and `todo_id` (sort key), both strings. The local Demo Todos belong to the Demo Owner, `demo-owner`, as in the real table. Source: `infra/modules/app/dynamodb.tf`.
4. `pnpm dev` serves the frontend on port 9000 and the API on port 3000.
5. The API's dev server listens on `localhost` only. Source: `app.listen` in `api/dev/server.ts`.
6. No unit test reaches DynamoDB.
7. The same commands work on macOS, Linux, WSL and Windows itself (`docs/local-development.md`, "Supported systems"). `pnpm dev` and the reset need no Bash. Only the optional setup script is Bash.
8. No `.tf` file changes. The deployed Lambda gets only `TODOS_TABLE` and `NODE_OPTIONS` (`infra/modules/app/main.tf`). A refusal in the API's own code would break every request to the Lambda.

## Implementation Decisions

### The database setting

- One variable, `DATABASE`, in `api/.env`, with the values `local` and `dev`. `api/.env.example` sets `local`, with a comment. Later, staging and production can be more values of the same variable.
- `dev` uses the real `tdl-dev-todos` table through the AWS SDK, as today. The developer runs `aws login` first.
- The Lambda's code sets the local address only when `DATABASE=local`, and otherwise works as today. The reason: the Lambda never gets `DATABASE`.
- A new exported function turns a `DATABASE` value into the DynamoDB client's settings. The Repository builds its client from the function's result. The reason: the endpoint test drives this function (see Testing Decisions).
- With `local`, the function gives the endpoint `http://localhost:8000` and the fake credentials and region. The reason: without the fake credentials, the "Local, no AWS login" scenario can't pass.
- The function gives the local address only for `local`. For `dev`, no value or any other value, the function gives the settings of today. The function never throws. The reason: only the dev server refuses a missing or unknown `DATABASE`.
- `pnpm invoke` runs the Lambda's code, so `pnpm invoke` follows the same function. `pnpm invoke` doesn't refuse a missing or unknown `DATABASE`.
- The local table keeps the name `tdl-dev-todos`. The reset and the API both read the name from `TODOS_TABLE` in `api/.env`. Switching between `local` and `dev` changes only the database setting. The reason: DynamoDB Local is a separate server, so the two tables can share the name.

### The dev server

- `api/dev/server.ts` stops at startup unless `DATABASE` is `local` or `dev`, with `DATABASE must be local or dev (see api/.env.example)`.
- The refusal works like the missing `PORT` check of today. `nodemon` shows the error and waits. The frontend and DynamoDB Local keep running. When the developer saves `api/.env` with a valid value, `nodemon` starts the server again. The reason: `nodemon` already watches `api/.env`, and `docs/local-development.md` says that the server waits after an error.
- With `local`, the dev server skips the AWS credentials check and never prints `NOT_LOGGED_IN_MESSAGE`. With `dev`, the check stays as today.

### Running DynamoDB Local

- `pnpm dev` starts DynamoDB Local every time, even when `api/.env` says `dev`. The start is a plain `java` command, with no Bash. The reason: a condition on the setting needs a script, and a script needs Bash. DynamoDB Local costs only a little memory when it isn't used.
- The API's `dev` script splits into a server script and a DynamoDB Local script. The server script is the whole `nodemon` command, unchanged.
- The API's `dev` script runs both scripts with `pnpm run --no-bail "/^dev:/"`. The reason: pnpm 10.34.5 runs every script that matches the pattern side by side. By default, pnpm stops the other scripts when one fails. With `--no-bail`, the other scripts keep running (rule 5).
- DynamoDB Local keeps its data in a folder on disk, next to the download. Git ignores the folder. Only the reset command brings the Demo Todos back.

### The setup script

- The setup script is a small Bash script in the root `bin/` folder, with a minimum of error checks. No `package.json` script runs it. The script does nothing else than the two installs below. The reason, in the developer's words: "the most simplistic batch script you can think of, with a minimum of error checking, just to install these two things".
- If `java` isn't found, the script runs `sudo apt update`, then `sudo apt install -y openjdk-21-jre-headless`. The command works on WSL and Ubuntu only. The script checks only that `java` exists, not its version.
- If DynamoDB Local is missing, the script downloads and unpacks DynamoDB Local.

### The docs

- `docs/local-development.md` gives both ways to install. On WSL and Linux: run the setup script. On every other system: install Java 17 or newer, then download and unpack DynamoDB Local into the right folder. The docs show the download command.
- "First-time setup" gets two new steps after `pnpm install`: run `bin/setup-local-db.sh` (or the manual steps), then run `pnpm db:reset` once.
- Step 5, "Sign in to AWS", becomes a step for `DATABASE=dev` only.
- "Supported systems" stays as it is.
- `README.md` changes too. The "Quick start" runs `bin/setup-local-db.sh` and `pnpm db:reset` in place of `aws login`. "Prerequisites" names Java. "Scripts" gets `pnpm db:reset`. The reason: otherwise the first page of the repo tells a new developer to run `aws login`.
- `docs/adding-and-removing-resources.md` gets one row for the seed file in `api/dev/seeds/`, and one row for the lines in the reset. The reason: the doc lists every place that a Resource touches, and the reset becomes one of those places.

### Reset Local Database and the Seed

- The Demo Todos move to `api/dev/seeds/todos.ts`, one file for the todos table. The Lambda bundle no longer carries them. The reason: only the API uses the database, and `api/dev/` already holds the local tools.
- The seed file maps each Owner's ID to that Owner's Todos: `{ "demo-owner": [six Todos] }`.
- The six Demo Todos get fixed IDs in the seed file. The IDs are in the list's order, so the list shows the Demo Todos in the design's order. Each reset puts the same six IDs back.
- Each seed row has `version` 1, as the Demo Todos have today in the Restore Demo Todos route handler.
- The reset is one small TypeScript file. The file sends its requests with the AWS SDK that the API already has. `node` runs the file directly. The reason: the AWS docs show the CLI and the SDKs for DynamoDB Local, not raw HTTP.
- The reset names the todos table in its code, with the keys `owner_id` and `todo_id`, and reads `api/dev/seeds/todos.ts`. A later table adds about 10 lines to the reset. The reason, in the developer's words: "I just want to make it as simple as possible and I'm not that worried about it being generic."
- The reset deletes the local todos table, creates the table again, and fills the table with the six Demo Todos. The reset never touches the dev table in AWS.
- The reset always stops the DynamoDB Local that the reset started, also after a failure. Then the reset exits with code 1. The reset never stops a DynamoDB Local that was already running. The reason: a left-over Java process breaks the next `pnpm dev`.
- No accidental step may let the reset reach the dev table, even when `api/.env` selects `dev`. A seed of staging or production must never exist.
- The root `package.json` gets `db:reset`, which calls the API's script with `pnpm --filter @to-do-list/api`.

### Deleting the route

- The feature deletes the route from the code and from `routes.json`. The developer runs `pnpm deploy:dev`, when the developer chooses.
- The feature deletes every part that exists only for the Restore Demo Todos link and its route, except two parts:
  - The Restore Demo Todos link stays on the Home Page, hidden, for a later use.
  - The `restoreLink` class in `Home.module.scss` stays.
- In the code of today, these parts exist only for the link and its route:
  - In the API: the route's entry in `routes.json`, the route handler `restoreDemoTodos` and its line in the handler registry, the Repository's `restoreDemoTodos`, and the Outcome `restored`.
  - Also in the API: the route handler's test and the route's sample event.
  - In the frontend: the API Function `restoreDemoTodos`, the API Hook `useRestoreDemoTodos`, and the Home Page's `confirmRestore` and its call of `useRestoreDemoTodos`.
  - `DEMO_TODOS` and its file go too. The Demo Todos move to the seed file.
  - The text about the temporary route in `api/CLAUDE.md` and `frontend/CLAUDE.md`, and the lines about the route in `docs/structure.md`.
- The `Anchor` stays in `Home.tsx`, with its text and its `restoreLink` class. The feature removes its `onClick` and adds Mantine's style prop `display="none"`. A comment says that the link waits for a new use.
- `GLOSSARY.md` already has **Reset Local Database** and **Seed**, and no longer has Restore Demo Todos.

### Conflict with an ADR

None. The design follows `docs/adr/0002-dynamodb-local-for-local-work.md`.

Starting points: verify before trusting.

- `api/src/resources/todos/todos-repository.ts`
- `api/src/resources/todos/demo-todos.ts`
- `api/src/resources/todos/route-handlers/restore-demo-todos.ts`
- `api/src/router/handler-registry.ts`
- `api/src/route-handler-tools/outcome-codes.ts`
- `api/routes.json`
- `api/dev/server.ts`
- `api/dev/sample-events/todos/restore-demo-todos.json`
- `api/dev/` (new: the reset, and `seeds/todos.ts`)
- `api/tests/resources/todos/route-handlers/restore-demo-todos.test.ts`
- `api/tests/` (new: the router test and the endpoint test)
- `api/package.json`
- `api/.env.example`
- `package.json`
- `.gitignore`
- `bin/` (new)
- `frontend/src/api/todos.ts`
- `frontend/src/api-hooks/todos.ts`
- `frontend/src/pages/Home/Home.tsx`
- `frontend/tests/` (new: the Home Page test)
- `docs/local-development.md`
- `docs/adding-and-removing-resources.md`
- `README.md`
- `docs/structure.md`
- `api/CLAUDE.md`
- `frontend/CLAUDE.md`

## Prior Art

- **The reset, a `.ts` file in `api/dev/`**: `api/dev/invoke.ts`. Copy: its header comment with a usage line. Copy how it runs: `node --env-file=.env` on a `.ts` file, from an `api/package.json` script. Don't copy: its Lambda handler and bundle code.
- **The seed file, `api/dev/seeds/todos.ts`**: `DEMO_TODOS` in `api/src/resources/todos/demo-todos.ts`. Copy: the six titles, their `completed` values, and their order. Don't copy: anything else, because `DEMO_TODOS` has no IDs and no Owner.
- **The local address in the DynamoDB client**: `todos-repository.ts`, where it reads `TODOS_TABLE`. Copy: the check that throws when a required variable is missing. Don't copy: no other change to the Repository.
- **The login check with `local`**: `api/dev/server.ts`, `NOT_LOGGED_IN_MESSAGE` and `isCredentialsError`. Copy: the check itself, which stays for `dev`. Don't copy: nothing, because this part changes existing code only.
- **The API's `dev` script, split into a server script and a DynamoDB Local script**: the `dev` script in `api/package.json`. Copy: the whole `nodemon` command, unchanged, as the server script. Don't copy: nothing else.
- **The root reset command**: `deploy:dev` in the root `package.json`. Copy: the call into the API with `pnpm --filter @to-do-list/api`. Don't copy: the build and the Terraform step.
- **The setup script in `bin/`**: the first of its kind.
- **The docs**: "First-time setup" and "Settings" in `docs/local-development.md`. Copy: the numbered steps, and the table of variables. Don't copy: step 5, "Sign in to AWS", as a step that every developer needs.

## Testing Decisions

The developer approved four seams:

1. **The running app, checked by hand.** The closing manual check runs `pnpm dev`, `pnpm db:reset`, the browser and `bin/setup-local-db.sh`. This seam covers every scenario in rules 1 to 12, and the 404 of rule 13. These scenarios need a real DynamoDB Local, and no unit test runs against DynamoDB Local.
2. **The Home Page, rendered in a frontend test.** This seam covers rule 14: the text "Restore demo todos" doesn't show. The Home Page is the highest seam that shows the link. No Home Page test exists yet, so the builder adds the first one.
3. **The `routes` list that `src/router/routes.ts` exports, in a new router test.** This seam covers rule 13: the list has no `POST /api/demo-todos/restore`. The 404 comes from the dev server and API Gateway, not from the router. Both answer 404 for each route that `routes.json` doesn't have. A test can't drive `api/dev/server.ts`, because the server starts to listen as soon as a test imports it.
4. **The new exported function that turns a `DATABASE` value into the DynamoDB client's settings.** This seam covers the endpoint for `local`, `dev` and no value. For `local`, the test also checks the fake credentials and region. Today the client is private inside the Repository, so no existing seam can show its endpoint. Without the new function, a test must mock the SDK's constructor, and then the test reaches inside the code.

How much testing:

- Each automated test checks external behavior only. The test drives a scenario's Given through the seam, and checks its Then as literal values.
- The tests run in the existing Vitest setups of `api/` and `frontend/`. No test runs in a browser, and no test reaches DynamoDB.
- The closing manual check is one run on the developer's machine.

Similar existing tests:

- The route handler tests in `api/tests/resources/todos/route-handlers/`, for the API's Vitest style.
- The component tests in `frontend/tests/components/`, with `frontend/tests/test-utils/render.tsx`, for rendering with Mantine.

## Builder's Discretion

- **The setting:** `DATABASE` in `api/.env`, with `local` or `dev`. `api/.env.example` sets `local`, with a comment.
- **DynamoDB Local's port:** a fixed 8000, written in the start command, the client and the reset. No new variable.
- **DynamoDB Local's folder:** `api/.dynamodb-local/`, ignored by git. The data goes in `api/.dynamodb-local/data/`.
- **One data file:** DynamoDB Local starts with `-sharedDb`, so the API and the reset see the same tables.
- **No telemetry:** DynamoDB Local starts with `-disableTelemetry`. Git ignores `api/dynamodb-local-metadata.json`, which DynamoDB Local writes into the folder where it runs.
- **The fake credentials:** access key `local`, secret `local`, region `local`. The reset and the API with `local` both use them.
- **The download:** AWS's link to the latest version, `dynamodb_local_latest.tar.gz`, not a pinned version.
- **The file names:** `bin/setup-local-db.sh` for the setup script, and `api/dev/reset-local-db.ts` for the reset. The root command is `pnpm db:reset`.
- **The seed IDs:** six fixed IDs in the UUIDv7 form. The IDs grow smaller down the list, because the list shows the largest ID first.
- **The wait limit:** the reset waits 10 seconds at most for DynamoDB Local to answer.

Everything else, the builder decides alone.

## Deferred

- **A message from `pnpm dev` when DynamoDB Local isn't installed**: deferred because the developer wanted no scope increase. A later change can make `pnpm dev` print `DynamoDB Local isn't installed. Run bin/setup-local-db.sh.` in place of Java's error. Adding it later costs about 10 lines: the start becomes a short Node file that checks for the folder.
- **`DATABASE` in Terraform**: deferred because only the dev environment exists today, and a Terraform change was out of scope. The staging and production feature can add `DATABASE` to each Lambda's variables, and move the refusal into the API's code. Adding it later costs one variable in `infra/modules/app/main.tf`, and one check moved from the dev server to the Repository.
- **Reset of the dev table**: deferred to a later feature. The dev reset shows a stern warning and asks for yes or no, for example: "You're modifying a live database on dev." The dev reset works for dev only, never for staging or production. The dev reset must not delete the table, because Terraform manages the table. The dev reset deletes the Demo Owner's Todos and writes the Demo Todos. Adding it later costs little, because the Seed code and the seeds folder exist by then.
- **Test User**: deferred because end-to-end tests don't exist yet. A later end-to-end testing feature can add a test user with its own Todos to the local database. Adding it later costs little: the later feature adds the test user's Todos to the Seed.

## Rejected Alternatives

- **A separate root command for the dev table, such as `pnpm dev:aws`**: rejected because one variable in `api/.env` selects the database.
- **Start DynamoDB Local only with `local`, through a Bash script**: rejected because `pnpm dev` must need no Bash.
- **A separate `pnpm db:start` in a second terminal**: rejected because the developer runs the whole app with `pnpm dev`.
- **A setup command in `package.json`**: rejected because the setup script just sits in `bin/`.
- **`curl` in Bash for the reset**: rejected because AWS doesn't document it, and it needs hand-made signed headers.
- **The AWS CLI for the reset**: rejected because every developer would install it.
- **New UUIDv7 IDs on each reset**: rejected because each reset puts the same six IDs back.
- **A generic reset that reads every file in `api/dev/seeds/`**: rejected because a generic reset needs a seed file format with keys and plain rows. That format would replace the layout grouped by Owner.
- **A subfolder for each table in `api/dev/seeds/`, or JSON seed files**: rejected because a folder that holds one file adds nothing.
- **A separate name for the local table**: rejected because DynamoDB Local is a separate server, so the two tables can share the name.
- **A refusal in the Repository, with `DATABASE=dev` added to the Lambda in Terraform**: rejected because no `.tf` file changes.
- **Data in memory for DynamoDB Local**: rejected because the local Todos survive a stop and a start.
- **The link's JSX as a comment**: rejected in favor of `display="none"`.
- **Deleting the link and its class**: rejected because, in the developer's words, "later that link will be repurposed, or at least its style".
- **A reminder from `pnpm dev` or from `postinstall` to run the setup**: rejected because the reminder is in the docs only.

## Open Questions

None.
