# Spec review: reviewer a

## Paraphrase

I add one variable, `DATABASE` (`local` or `dev`), to `api/.env`. With `local`, the Repository's DynamoDB client points at `localhost:8000`. With `dev`, or with no value (the Lambda), it works as today. A new exported function turns the value into the client settings.

`api/dev/server.ts` refuses to start unless `DATABASE` is `local` or `dev`. With `local`, it skips the credentials check and the login message.

`api/package.json` splits `dev` into a nodemon server script and a DynamoDB Local `java` script. `dev` runs both with `pnpm run --no-bail "/^dev:/"`. Data lives in `api/.dynamodb-local/data`, with `-sharedDb`.

`api/dev/reset-local-db.ts` talks to `localhost:8000` with fake credentials. It starts DynamoDB Local if it isn't running. It drops and creates the table, writes six seed rows from `api/dev/seeds/todos.ts`, and stops DynamoDB Local only if it started it. The root script `pnpm db:reset` calls it.

`bin/setup-local-db.sh` installs Java with apt and downloads DynamoDB Local.

I delete the restore route, its handler, its tests, its sample event and its frontend API function and hook. The Restore link stays in `Home.tsx` with `display="none"`.

I update the docs, and add three tests: a Home Page test, a router test and an endpoint-function test.

## Predictions

| Rule | Scenario | Predicted Then |
| --- | --- | --- |
| 1-3 | Local list | The Home Page lists the six Demo Todos, in the design's order. |
| 1-3 | Local create | "Buy milk" is stored in DynamoDB Local and shown first. |
| 1-3 | Local, no AWS login | Todos work, with no `aws login` message. This relies on fake credentials in the API client, which the spec leaves open (Open Question 1). |
| 1-3 | Dev, logged in | Routes use the real `tdl-dev-todos` table. |
| 1-3 | Dev, not logged in | The startup warning `NOT_LOGGED_IN_MESSAGE` prints, and requests return 500 with the same message in the log. |
| 4-6 | Start | DynamoDB Local, the API and the frontend all start. The frontend runs on 9000 and the API on 3000. |
| 4-6 | Stop | All three stop. The spec doesn't say how the java process is guaranteed to end. |
| 4-6 | Not installed | Java's error shows. The frontend and the API keep running. Todo routes return 500. |
| 4-6 | Port taken | DynamoDB Local's bind error shows. The frontend and the API keep running. The spec doesn't say what the API does, because it then talks to the other program. |
| 4-6 | Data kept | "Buy milk" is still there after the restart. |
| 7-10 | Reset after changes | The table holds exactly the six Demo Todos, with no "Buy milk" and with "Read for 1 hour" back. |
| 7-10 | Reset twice | The same result both times, with the same six IDs. |
| 7-10 | First reset | The table is created and seeded, with no error from the missing table. |
| 7-10 | Reset with dev selected | The reset works against DynamoDB Local with fake credentials. |
| 7-10 | The order | "Complete online JavaScript course" is first and completed, then the other five in the design's order. |
| 9 | Not running | The reset starts DynamoDB Local, waits, resets, and stops it. It prints one message per step. |
| 9 | Running | The reset uses the running instance and leaves it running. |
| 9 | Can't start | The spec doesn't say: the exit code, the message, and what happens after the 10-second limit. |
| 11 | No table yet | The route returns 500 `Internal Server Error`. The error shows in the dev server's console. |
| 12 | Fresh machine | Java is installed with sudo apt. DynamoDB Local is downloaded and unpacked into `api/.dynamodb-local/`. |
| 12 | Java already there | Only DynamoDB Local is downloaded. |
| 12 | Both there | Nothing is installed. The spec doesn't say what the script prints. |
| 13 | Removed route | 404 with `{"message":"Not Found"}`. |
| 14 | Hidden link | The link is not visible. |
| Setting | Missing, dev server | It stops with `DATABASE must be local or dev (see api/.env.example)`. |
| Setting | Unknown, dev server | The same message. |
| Setting | Local | Client at `localhost:8000`, no login check. |
| Setting | Dev | The AWS default client, and the login check. |
| Setting | Deployed Lambda | The AWS default client, as today, with no refusal. |

## Findings

### F1 - Blocker - The API's credentials and region for `local` are open

- **Where:** Open Questions 1, and Builder's Discretion "The fake credentials".
- **Problem:** The spec lists the fake credentials only as the reset's. No decision says the API client uses them. The endpoint function's result (the "settings" the test checks as literal values) has no defined shape. It may hold only the endpoint, or also the credentials and region.
- **Why it matters:** Without credentials in the client, "Local, no AWS login" fails. One builder passes the fake credentials and another doesn't. The endpoint test checks different values.

### F2 - Major - How the reset knows DynamoDB Local is "running"

- **Where:** Rule 9, and the "Port taken" and "Running" scenarios.
- **Problem:** The spec doesn't say how the reset detects a running instance: a probe request, a port check, or whatever. It doesn't say what happens when port 8000 holds another program. It also doesn't say what the reset does when its own start fails because another instance holds the data folder.
- **Why it matters:** Builders will ship different behavior in these cases. One tries to start a second instance. Another resets whatever answers on 8000.

### F3 - Major - "Can't start" and the wait timeout have no Then

- **Where:** Rule 9, the "Can't start" scenario, and "The wait limit".
- **Problem:** The spec doesn't say what the reset prints or returns on failure. It doesn't say whether the exit code is nonzero. It doesn't say whether the reset still stops the child process it started. It doesn't say what happens at the 10-second limit.
- **Why it matters:** The exit code and the message are what the manual check observes. Builders will make different choices.

### F4 - Major - "DynamoDB Local isn't there" in the setup script has no test

- **Where:** Rule 12, and Implementation Decisions "The setup script".
- **Problem:** The spec doesn't say what the script checks to decide that DynamoDB Local is there (a folder, or the jar). `api/.dynamodb-local/` also holds the data folder, which `pnpm dev` may create before the download. Then the folder exists but the download is missing.
- **Why it matters:** Builders could skip the download wrongly, or download over existing data. A "Both there" run that prints nothing is also unspecified.

### F5 - Major - The hidden link and the Home Page test don't fit together

- **Where:** Rule 14, and Testing Decisions seam 2.
- **Problem:** The link stays in the DOM with `display="none"`. The test checks that the text "Restore demo todos" doesn't show. A text query still finds hidden elements, and only a visibility assertion passes. The spec also gives the text in two spellings ("Restore Demo Todos" and "Restore demo todos").
- **Why it matters:** One builder writes a test that fails against the correct implementation. Another weakens it.

### F6 - Major - README and the other docs are left open

- **Where:** Open Questions 2 and 3.
- **Problem:** Two questions are unanswered, and the spec doesn't mark them as Builder's Discretion. The README's Quick start tells the developer to run `aws login`, which contradicts the new flow. `docs/adding-and-removing-resources.md` and `api/CLAUDE.md` ("temporary route" text) may also need changes.
- **Why it matters:** Builders will ship different docs. Some leave README contradicting the feature.

### F7 - Major - Other `.env` consumers of the API

- **Where:** Implementation Decisions "The database setting", and Invariant 2.
- **Problem:** `pnpm invoke` (`dev/invoke.ts`) also loads `api/.env` and calls the Repository. The spec says only the dev server refuses a missing or unknown `DATABASE`. It doesn't say what `invoke` does with `local`, with a missing value, or with an unknown value. An unknown value in the endpoint function is also unspecified: it may fall back to AWS or throw.
- **Why it matters:** A developer with an old `.env` could have `invoke` write to the real dev table. Builders will choose differently.

### F8 - Major - Rule 4's "Ctrl+C stops all three" depends on `pnpm run --no-bail` and a java child

- **Where:** Rules 4 and 5, and "Running DynamoDB Local".
- **Problem:** The spec claims how pnpm 10.34.5 behaves, but no seam checks it. It doesn't say how the root `pnpm dev` combines the frontend and the API scripts with the new pattern run. It doesn't name the new script names (the pattern `/^dev:/` constrains them). If the API server stops on the `DATABASE` refusal, nodemon waits for a change. Whether the frontend then keeps running is not stated.
- **Why it matters:** Builders may find, when they test it, that Ctrl+C leaves java running, and then ship different fixes.

### F9 - Major - A removal with no behavior statement for the deployed route

- **Where:** Scope, and Rule 13.
- **Problem:** After the code change and before `pnpm deploy:dev`, the deployed API still has the route. The router check for `routes.json` and the registry then disagree. Rule 13 says 404 only for the dev server.
- **Why it matters:** The "removed route" scenario's Then is observable only locally. The spec doesn't say that. A builder might also leave the sample event or the handler's test behind.
