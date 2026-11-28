# Spec review: reviewer b

## Paraphrase

`pnpm dev` runs the frontend, the API and a DynamoDB Local (Java, port 8000, shared DB, data in `api/.dynamodb-local/data/`), using `pnpm run --no-bail "/^dev:/"`. `DATABASE` in `api/.env` is `local` or `dev`. A new exported function maps the value to DynamoDB client settings (local: endpoint, fake credentials, region; otherwise as today). The dev server refuses a missing or unknown value and skips the login check with `local`. `pnpm db:reset` runs a TypeScript file that starts DynamoDB Local if needed, drops and recreates the table, writes six fixed-ID seed rows, and stops the instance it started. A Bash script installs Java and DynamoDB Local. The restore route, its code and the link's handler are deleted. The link stays hidden with `display="none"`. Docs and README are updated.

## Predictions

| Rule | Scenario | Predicted Then |
| --- | --- | --- |
| 1-3 | Local list | The Home Page lists the six Demo Todos, "Complete online JavaScript course" first and completed. |
| 1-3 | Local create | "Buy milk" appears at the top of the list, and it persists in DynamoDB Local. |
| 1-3 | Local, no AWS login | The routes work, and there is no `aws login` message. |
| 1-3 | Dev, logged in | The routes read and write the real `tdl-dev-todos` table. |
| 1-3 | Dev, not logged in | The dev server prints `NOT_LOGGED_IN_MESSAGE`, as today. The status code is not given (likely 500). |
| 4-6 | Start | Frontend on 9000, API on 3000, DynamoDB Local on 8000. |
| 4-6 | Stop | All three stop, and no Java process is left. |
| 4-6 | Not installed | Java's error shows. The frontend and API keep running. Todos routes give 500. |
| 4-6 | Port taken | The spec doesn't say what happens to the other program's data. The terminal shows the error, the frontend and API run, and the API gives 500. |
| 4-6 | Data kept | "Buy milk" is still in the list. |
| 7,8,10 | Reset after changes | Exactly the six Demo Todos, with no "Buy milk" and with "Read for 1 hour" restored. |
| 7,8,10 | Reset twice | Same result both times, with the same six IDs. |
| 7,8,10 | First reset | The table is created and seeded, with no error. |
| 7,8,10 | Reset with dev selected | The reset works on local DynamoDB Local and needs no credentials. |
| 7,8,10 | The order | Six todos in the design's order, with the "Complete online JavaScript course" todo first and completed. |
| 9 | Not running | Step messages are printed. DynamoDB Local starts, the table is reset, DynamoDB Local stops, and the exit code is 0. |
| 9 | Running | The reset uses the running instance and leaves it running. |
| 9 | Can't start | An error is printed and the exit code is 1. The message text is not given. |
| 11 | No table yet | The todos routes answer 500. |
| 12 | Fresh machine | Java is installed with apt, DynamoDB Local is downloaded and unpacked. |
| 12 | Java already there | Only DynamoDB Local is installed. |
| 12 | Both there | Nothing changes, with no error. |
| 13,14 | Removed route | 404 with `{"message":"Not Found"}`. |
| 13,14 | Hidden link | The text "Restore demo todos" is not visible. |
| Setting | Missing, dev server | The server stops with `DATABASE must be local or dev (see api/.env.example)`. |
| Setting | Unknown, dev server | Same message and stop. |
| Setting | Local | The endpoint is `http://localhost:8000`, with fake credentials. |
| Setting | Dev | The settings of today, with no endpoint. |
| Setting | Deployed Lambda | The settings of today, with the real DynamoDB. |

## Findings

### F1 - Major - Starting DynamoDB Local twice on the same data folder

- **Where:** Rule 9, rule 4, Builder's Discretion ("One data file", `-sharedDb`)
- **Problem:** "Running" is never defined. It could mean port 8000 answers, or a process is found. The case where `pnpm dev` is starting while a reset starts its own copy is not covered. Both would open the same data folder and a lock error could follow. The case "a foreign program on 8000" says the reset exits 1, so "running" means "something answers on 8000". The spec doesn't say this directly.
- **Why it matters:** Two builders would detect "running" in different ways (a port probe, a ListTables call, or a process check). The behavior differs when a foreign program holds the port.

### F2 - Major - The reset's success output and exit code

- **Where:** Rule 9, Reset Local Database implementation notes
- **Problem:** "A short message for each step" does not list the steps. Exit code 0 on success is implied, and exit 1 is given only on failure. The messages for "Can't start" and for "wait limit exceeded" are not given. A reset that fails after DynamoDB Local was already running is not stated either: does the run leave the table half done?
- **Why it matters:** The manual check cannot say what the developer should see, and builders will print different things.

### F3 - Major - Dev, not logged in: Then is not a value

- **Where:** Rules 1-3, scenario "Dev, not logged in"
- **Problem:** The spec says only "the login check works as today". The status code and the output of an API request (and the frontend's view of it) are not given. The spec does not say whether the Home Page shows an error.
- **Why it matters:** The spec leaves it to the builder to read the code of `dev/server.ts` to learn the behavior. The manual check has no expected result.

### F4 - Major - `api/.env` already has `LOCAL_DB_PORT=8000`

- **Where:** Builder's Discretion ("DynamoDB Local's port: ... No new variable"); `api/.env` line 14
- **Problem:** A `LOCAL_DB_PORT=8000` variable already exists in the developer's `api/.env`. The spec says the port is fixed and has no variable, and it doesn't say whether to remove or ignore the existing one. It is also not clear if `.env.example` has it.
- **Why it matters:** One builder reads it for the port, and another hard-codes 8000. If the developer sets another port, the behavior differs.

### F5 - Major - The `DATABASE` check and the reset/invoke when the variable is missing

- **Where:** Implementation Decisions, "The database setting" and "The dev server"
- **Problem:** `pnpm db:reset` loads `api/.env` through `node --env-file`. The reset ignores `DATABASE`. It still reads `TODOS_TABLE` from `api/.env`. The spec does not say what happens if `TODOS_TABLE` is missing for the reset. The reset might import the Repository and its module-level throw, or might read the variable on its own. The reset could also import the client-settings function, but rule 8 says it ignores `DATABASE`.
- **Why it matters:** Builders may share code between the reset and the Repository (which then loads `DATABASE`-dependent code) or write separate code.

### F6 - Major - Stopping the Java process on Ctrl+C

- **Where:** Rule 4 and the "Stop" scenario
- **Problem:** "Ctrl+C stops all three" is a requirement. It is observable only by hand. The spec does not say what to do when the Java process stays after Ctrl+C (the spec itself says that a leftover Java process breaks the next `pnpm dev`). Nothing says how to check that no Java process is left. Also, the way `pnpm run --no-bail` handles Ctrl+C and child processes is a claim that nothing here proves.
- **Why it matters:** The builder can pass the manual check on one machine and leave a stale Java process on another.

### F7 - Major - Reset: partial failure and the table in "dev" mode in the same process

- **Where:** Rule 7, rule 9 and "No accidental step may let the reset reach the dev table"
- **Problem:** The reset "ignores `DATABASE`", but the spec does not say how the reset behaves when `AWS_*` or `AWS_ENDPOINT_URL*` environment variables, or `AWS_PROFILE`, are set on the machine. Those can steer the SDK. Also, the spec does not say whether the reset's client sets the endpoint explicitly. "Fake credentials" are named, so the endpoint probably is.
- **Why it matters:** The guarantee "never writes to AWS" is "trusted, no handling". Two builders could build a client that differs here.

### F8 - Major - "Port taken" scenario and "Not installed" scenario message

- **Where:** Rules 4-6 and the Deferred section
- **Problem:** With a missing folder, "the terminal shows DynamoDB Local's error": the real text is Java's error, which the spec does not name. With the port taken by a non-DynamoDB program, the Then depends on the "Also checked" paragraph, which covers only a foreign program. A second DynamoDB Local (for example one from an earlier `pnpm dev`) is a different case, and the spec does not cover it.
- **Why it matters:** The manual check has no expected text. A second `pnpm dev` is a likely real event.

### F9 - Major - The Demo Todos' "design's order" and the seed IDs

- **Where:** Rule 10, Builder's Discretion ("The seed IDs")
- **Problem:** The spec says the list shows the largest ID first, which matches `reverse: true` in the Repository. The seed file is said to give the list's order. It does not say in which order the six rows go in the seed array, first-in-list first or last. The "UUIDv7 form" is also not defined for fixed values, such as which timestamp prefix to use.
- **Why it matters:** The Home Page order depends on the choice, and a builder can reverse the list by mistake. The spec's seam list has no automated test for the order.

### F10 - Major - README and `bin/` script behavior on macOS or Windows

- **Where:** Invariant 7, "The docs"
- **Problem:** The Quick start in the README runs `bin/setup-local-db.sh` in place of `aws login`. The script works on WSL and Ubuntu only (apt). The README must then say what a macOS or Windows developer does. The spec says the docs give both ways, but only for `docs/local-development.md`, not for the README.
- **Why it matters:** One builder points the README to the docs, another puts the manual steps in the README.
