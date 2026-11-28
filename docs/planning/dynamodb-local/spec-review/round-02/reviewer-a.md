# Spec review: reviewer a

## Paraphrase

I would add a `DATABASE` variable (`local` or `dev`) in `api/.env`. A new exported function maps it to DynamoDB client settings. For `local` it gives endpoint `http://localhost:8000`, with access key, secret and region `local`. For anything else it gives today's settings. The function never throws. `api/dev/server.ts` exits at startup with `DATABASE must be local or dev (see api/.env.example)` when the value is missing or unknown. With `local` it skips the credentials check.

The API's `dev` script splits into `dev:server` (the nodemon command) and a `dev:` script that runs `java` for DynamoDB Local (`-sharedDb`, data in `api/.dynamodb-local/data/`). `pnpm run --no-bail "/^dev:/"` runs both.

`api/dev/reset-local-db.ts` runs with `node --env-file=.env`. It checks whether DynamoDB Local answers on port 8000. If not, it starts DynamoDB Local and waits up to 10 seconds. It deletes the table, creates it with keys `owner_id` and `todo_id`, and writes six seed rows from `api/dev/seeds/todos.ts` (`demo-owner`, fixed UUIDv7 IDs in decreasing order, `version` 1). It stops only the DynamoDB Local that it started, and exits 1 on failure. The root `pnpm db:reset` calls it.

`bin/setup-local-db.sh` installs Java and DynamoDB Local. I would delete the restore route and its code, and hide the link with `display="none"`. I would update the docs and README, and add the tests that the spec lists.

## Predictions

| Rule | Scenario | Predicted Then |
| --- | --- | --- |
| 1-3 | Local list | After a reset, `GET` todos returns the six Demo Todos, "Complete online JavaScript course" first and completed. |
| 1-3 | Local create | "Buy milk" appears at the top of the list and is stored in DynamoDB Local. |
| 1-3 | Local, no AWS login | The dev server starts, prints no `aws login` message, and the todos routes work. |
| 1-3 | Dev, logged in | The routes use the real `tdl-dev-todos` table. |
| 1-3 | Dev, not logged in | The dev server prints `NOT_LOGGED_IN_MESSAGE`, as today. |
| 4-6 | Start | The frontend runs on 9000, the API on 3000 and DynamoDB Local on 8000. |
| 4-6 | Stop | Ctrl+C stops all three, and no Java process is left. |
| 4-6 | Not installed | Java's error shows in the terminal. The frontend and the API keep running. Todos routes fail with a 500. |
| 4-6 | Port taken | The spec doesn't say what the terminal shows. It names only a foreign program: the API's requests fail with a 500. DynamoDB Local's own error shows and the others keep running. |
| 4-6 | Data kept | "Buy milk" is still in the list after the restart. |
| 7, 8, 10 | Reset after changes | Exactly the six Demo Todos remain, with the same IDs and order. |
| 7, 8, 10 | Reset twice | The same result both times, and no error. |
| 7, 8, 10 | First reset | The table is created, then seeded. |
| 7, 8, 10 | Reset with dev selected | The reset works and never calls AWS. |
| 7, 8, 10 | The order | Six Demo Todos in the design's order. The first is "Complete online JavaScript course", completed. |
| 9 | Not running | Short step messages. The reset starts DynamoDB Local, resets, stops it, and exits 0. |
| 9 | Running | The reset uses the running DynamoDB Local and leaves it running. |
| 9 | Can't start | The reset prints an error, exits 1, and leaves no Java process. The exact text isn't specified. |
| 11 | No table yet | A todos route answers 500. |
| 12 | Fresh machine | `apt` installs Java, and DynamoDB Local is downloaded and unpacked. |
| 12 | Java already there | Only DynamoDB Local is installed. |
| 12 | Both there | Nothing changes, and the script exits 0. |
| 13, 14 | Removed route | 404 with `{"message":"Not Found"}`. |
| 13, 14 | Hidden link | The link isn't visible. |
| Setting | Missing, dev server | The server prints `DATABASE must be local or dev (see api/.env.example)` and stops. The spec doesn't say what the whole `pnpm dev` does. |
| Setting | Unknown, dev server | The same as missing. |
| Setting | Local | The endpoint is `http://localhost:8000`, with fake credentials. |
| Setting | Dev | Today's settings, with no endpoint. |
| Setting | Deployed Lambda | Today's settings, with no refusal. |

## Findings

### F1 - Major - What `pnpm dev` does when `DATABASE` is missing or unknown

- **Where:** "A missing or unknown database setting", "The dev server", and "The API's `dev` script runs both scripts with `--no-bail`".
- **Problem:** The spec says that `server.ts` "stops at startup". It doesn't say what happens to `pnpm dev` as a whole. With `--no-bail`, the frontend and DynamoDB Local keep running, so the terminal stays busy. `nodemon` may also keep waiting for a file change and restart on a fix. The spec gives no exit code and no restart rule. It doesn't say whether the `tsc && node` exec runs before the check.
- **Why it matters:** One builder lets `nodemon` wait, and the `.env` fix restarts the server. Another makes the whole command exit non-zero. A manual check can't tell which one is right.

### F2 - Major - The Home Page test can't observe `display="none"` as written

- **Where:** Rule 14, Testing Decisions seam 2, and "Deleting the route".
- **Problem:** The Then is "isn't visible". The seam is "the text 'Restore demo todos' doesn't show". The link stays in the DOM with Mantine's `display="none"`. In jsdom a text query still finds it. Only a visibility assertion (`toBeVisible`, or a computed style) sees the hiding. Mantine may also apply the style through a generated class that jsdom doesn't compute. The spec doesn't say which assertion counts, or whether jest-dom is available.
- **Why it matters:** One builder writes `queryByText(...)` expecting null, and the test fails. Another weakens the test until it passes. Neither proves the rule.

### F3 - Major - Install check for DynamoDB Local, and its folder, are unclear

- **Where:** Rule 12, the "Not installed" scenario, and Builder's Discretion (folder, data).
- **Problem:** The script installs DynamoDB Local "if it isn't there". The "Not installed" scenario says "DynamoDB Local's folder is missing". The data folder lives inside the same folder, `api/.dynamodb-local/data/`. The spec doesn't say what "there" means: the folder, or the jar. It doesn't say what happens when the folder exists because `pnpm dev` or a failed run created the data folder, but no jar is there. It doesn't say whether unpacking over existing data is safe, or whether "folder missing" also deletes the data.
- **Why it matters:** The "Second run is harmless" and "Both there" rules depend on this check. Builders could skip the download wrongly, or overwrite the local data.
