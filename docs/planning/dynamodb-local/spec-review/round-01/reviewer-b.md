# Spec review: reviewer b

## Paraphrase

I would add a `DATABASE` variable (`local` or `dev`) to `api/.env`. A new exported function turns its value into DynamoDB client settings, and the Repository builds its client from the result. With `local`, the client uses `http://localhost:8000`. With `dev` or no value, it works as today. The dev server refuses to start unless `DATABASE` is `local` or `dev`. With `local`, it skips the credentials check.

The API's `dev` script splits into `dev:server` (nodemon, unchanged) and `dev:dynamodb` (a plain java command). `pnpm run --no-bail "/^dev:/"` runs both. The root `pnpm dev` also runs the frontend.

A TypeScript reset file in `api/dev/` runs through the root `pnpm db:reset`. It starts DynamoDB Local if needed. It deletes and creates the table, then writes the six seeded Demo Todos from `api/dev/seeds/todos.ts`. It stops DynamoDB Local only if it started it.

A Bash script in `bin/` installs Java and DynamoDB Local. I would delete the restore route, its handler, its test, its sample event and its frontend API code. The link stays on the Home Page with `display="none"`. I would update the docs and add three tests.

## Predictions

| Rule | Scenario | Predicted Then |
| --- | --- | --- |
| Rules 1 to 3 | Local list | The Home Page shows the six Demo Todos in the design's order. |
| Rules 1 to 3 | Local create | "Buy milk" appears first in the list and is stored in DynamoDB Local. |
| Rules 1 to 3 | Local, no AWS login | Everything works. The server never prints the login message. |
| Rules 1 to 3 | Dev, logged in | Routes use the real `tdl-dev-todos` table. |
| Rules 1 to 3 | Dev, not logged in | The startup prints NOT_LOGGED_IN_MESSAGE, and requests answer 500. |
| Rules 4 to 6 | Start | DynamoDB Local on port 8000, the frontend on 9000 and the API on 3000 all run. |
| Rules 4 to 6 | Stop | All three processes stop. The spec doesn't say whether the java process stops with certainty. |
| Rules 4 to 6 | Not installed | Java prints an error. The frontend and API keep running. |
| Rules 4 to 6 | Port taken | The spec doesn't say: DynamoDB Local's error shows, but a `local` API would talk to the other program on port 8000. |
| Rules 4 to 6 | Data kept | "Buy milk" is still there after a restart. |
| Rules 7, 8 and 10 | Reset after changes | The list has the six Demo Todos. "Buy milk" is gone and "Read for 1 hour" is back. |
| Rules 7, 8 and 10 | Reset twice | The same six rows with the same IDs. |
| Rules 7, 8 and 10 | First reset | The reset creates the table and seeds it with no error. |
| Rules 7, 8 and 10 | Reset with dev selected | The reset works against localhost and needs no AWS login. |
| Rules 7, 8 and 10 | The order | "Complete online JavaScript course" is first and completed, then the other five in the design's order. |
| Rule 9 | Not running | The reset prints a message for each step: start, wait, reset, stop. It leaves DynamoDB Local stopped. |
| Rule 9 | Running | The reset uses the running server and leaves it running. |
| Rule 9 | Can't start | The spec doesn't say: it only gives a 10 second wait limit. It doesn't give the message or the exit code. |
| Rule 11 | No table yet | A todos route answers 500. |
| Rule 12 | Fresh machine | The script installs Java with apt, then downloads and unpacks DynamoDB Local. |
| Rule 12 | Java already there | The script skips Java and installs DynamoDB Local. |
| Rule 12 | Both there | The script does nothing and exits 0. |
| Rules 13 and 14 | Removed route | 404 with `{"message":"Not Found"}`. |
| Rules 13 and 14 | Hidden link | The text "Restore demo todos" isn't visible. |
| Missing or unknown | Missing, dev server | The server stops with `DATABASE must be local or dev (see api/.env.example)`. |
| Missing or unknown | Unknown, dev server | The same stop and message. |
| Missing or unknown | Local | The endpoint is `http://localhost:8000`. |
| Missing or unknown | Dev | No custom endpoint. |
| Missing or unknown | Deployed Lambda | No custom endpoint. The function works as today. |

## Findings

### F1 - Blocker - Port taken is undefined

- **Where:** Rules 4 to 6, scenario "Port taken".
- **Problem:** Another program holds port 8000, and DynamoDB Local fails. Rule 5 keeps the others running. The API with `local` then talks to that other program. The spec gives no expected result. It doesn't say whether the reset detects this. The reset's "already running" check would see a foreign server on port 8000 and treat it as DynamoDB Local.
- **Why it matters:** Builders would ship different reset behavior and different errors for a foreign server on 8000.

### F2 - Blocker - "Can't start" has no observable result

- **Where:** Rule 9, scenario "Can't start". The same gap hits "Not installed" in rule 5.
- **Problem:** The spec doesn't say what the reset prints, or whether it exits non-zero. It doesn't say how a failed start is told apart from a start that the reset waits out for 10 seconds. The cases are no `java`, a missing folder, and a port conflict. It doesn't say whether the reset tries to stop a half-started process.
- **Why it matters:** The exit code, the message and the cleanup are open.

### F3 - Major - How the reset knows DynamoDB Local is "running"

- **Where:** Rule 9.
- **Problem:** The spec gives no detection method. The options are a port probe, an SDK call such as ListTables, or a lock. It doesn't say how the reset starts DynamoDB Local: the same java command, detached or not, with the same data folder. A reset that starts a second instance with the same `-sharedDb` data folder could corrupt it.
- **Why it matters:** Builders would pick different probes and different timeouts, with different failure behavior.

### F4 - Major - The reset's error path when DynamoDB Local stops mid-way, and its stop on failure

- **Where:** Rule 9, with "Ctrl+C during the reset" marked as checked.
- **Problem:** If the table step fails after the reset started DynamoDB Local, the spec doesn't say whether the reset still stops it, or what exit code it gives.
- **Why it matters:** A left-over java process would hold port 8000 and trigger F1 on the next run.

### F5 - Major - The API's local credentials are an open question that the spec doesn't close

- **Where:** Open Questions 1, and the scenario "Local, no AWS login".
- **Problem:** The spec leaves open whether the API uses the fake credentials. The scenario can't pass without a decision. The Repository today builds `new DynamoDBClient()`. The spec doesn't say whether the new function returns the credentials and region as well as the endpoint. A builder who sets only the endpoint would still hit a credentials error on a machine with none. On a machine with a real AWS profile, the API would send real credentials to DynamoDB Local, which is harmless. The testable "endpoint for each value" seam also doesn't say whether the credentials are part of the checked result.
- **Why it matters:** The scenario passes or fails depending on the builder's guess.

### F6 - Major - "Dev" in the dev server vs. no value in the Repository

- **Where:** The database setting, Implementation Decisions and Testing seam 4.
- **Problem:** The function must handle no value (the Lambda) the same as `dev`. The spec doesn't say what it does for an unknown value such as `prod`. Options are to throw, or to return the default settings. The dev server refuses unknown values, so the function can't be reached with one there. A test could still call it.
- **Why it matters:** Two builders would ship a throw or a default.

### F7 - Major - `pnpm dev` at the root and `--no-bail` stopping behavior

- **Where:** Rules 4 and 5.
- **Problem:** The spec shows the API's `dev` script only. The root `dev` script isn't shown, so how the root combines the frontend and the API script is open. "Ctrl+C stops all three" is also open. With `pnpm run "/^dev:/"` and a java child process, Ctrl+C may leave java running, especially on Windows. The spec says Ctrl+C during the reset is "nothing to decide" but doesn't say how a running `pnpm dev` stops its java child. When java fails, `--no-bail` may also still exit the whole run non-zero at the end.
- **Why it matters:** An orphan java holding port 8000 would break the next start (F1).

### F8 - Major - `api/.env` is missing for existing developers and the `.env.example` copy step

- **Where:** Rules 1 to 3, and "A missing or unknown database setting".
- **Problem:** Existing developers have an `api/.env` with no `DATABASE`. After the change `pnpm dev` stops with the refusal message. The docs step that tells them to add the variable isn't named. The reset runs through `node --env-file=.env` and reads `TODOS_TABLE` from the same file. The spec doesn't say what it does if `TODOS_TABLE` is missing.
- **Why it matters:** The reset's error behavior is open. The docs' migration note is open.

### F9 - Major - The restore removal and the frontend leftovers aren't enumerated

- **Where:** Deleting the route.
- **Problem:** "Every part that exists only for the link and its route" is judged by the builder. The Home Page still uses the link, so a builder must decide the fate of the `useRestoreDemoTodos` hook, whether `restoreDemoTodos` in the Repository goes (it does only if the route uses it alone), and the `demo-todos.ts` file (replaced by the seed). The spec also lists outcome codes, but it doesn't say which are deleted. The "Demo Todos exist only as the Seed" rule hints that `DEMO_TODOS` goes. The `api/CLAUDE.md` text about the temporary route is also stale.
- **Why it matters:** The builder guesses which exports and codes to keep.

### F10 - Major - Rule 14 and the testable seam

- **Where:** Rule 14, Testing seam 2.
- **Problem:** The test checks that "Restore demo todos" doesn't show. With Mantine's `display="none"`, the text is still in the DOM. A test that uses `queryByText` would find it. A test that uses `getByText(...).not.toBeVisible()` depends on jsdom's CSS handling. Mantine's style prop writes inline or injected CSS, and jsdom may not see it. Rule 14 says "isn't visible", but the test says "doesn't show". The spec doesn't say which matcher or text case applies.
- **Why it matters:** The test may pass or fail depending on the method, and it may not detect a visible link.

### F11 - Major - The seed's IDs and the "largest first" order

- **Where:** Builder's Discretion, "The seed IDs", and rule 10.
- **Problem:** The list shows the largest ID first, so "Complete online JavaScript course" gets the largest ID. The Builder's Discretion says "IDs grow smaller down the list". That agrees. The spec doesn't say the six titles' order in the design, except by pointing at `DEMO_TODOS`. The `version` value of each seeded row is also unstated (the Todo schema has `version`, 1 by default for new ones).
- **Why it matters:** The version of seeded rows would differ, and so would the Home Page behavior on a toggle.

### F12 - Major - The setup script's folder and the download layout

- **Where:** Rule 12, Implementation Decisions.
- **Problem:** The script must put the files in `api/.dynamodb-local/`, and the start command must find the jar there. The spec doesn't say what the folder holds after unpacking (the jar and `DynamoDBLocal_lib`) or what "DynamoDB Local is missing" tests (the folder or the jar). It also doesn't say that the script must be run from a given directory. A second run of the script after a half-finished unpack is also open. Whether the script has `set -e` isn't said. "A failed download" is "nothing to decide", but a half-written folder would then count as installed.
- **Why it matters:** "Both there" and the "Not installed" start can disagree between builders.

### F13 - Major - Rule 11 and "500" vs. the dev server's log

- **Where:** Rule 11.
- **Problem:** The 500 comes from the thrown error, which the dev server logs. The spec doesn't say what the developer sees in the terminal or the browser. The Home Page error state isn't specified.
- **Why it matters:** The scenario's Then isn't a precise value.
