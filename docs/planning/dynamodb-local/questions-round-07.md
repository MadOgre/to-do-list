# Round 7 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded round 6 in `decisions.md`. This round gives each rule its concrete cases (Q1 to Q7), asks about one gap (Q8), says how each case gets checked (Q9), and lists the builder's choices (Q10). Each table names the database setting `DATABASE`, as Q10 proposes.

---

❓ **Q1** - **Rules 1 to 3: the database setting**: Are these results right?

| Scenario | Given | Then |
| --- | --- | --- |
| Local list | `DATABASE=local`, after a reset | `GET /api/todos` returns the six Demo Todos |
| Local create | `DATABASE=local`. You add "Buy milk" on the Home Page | "Buy milk" is in DynamoDB Local. The dev table in AWS has no "Buy milk" |
| Local, no AWS login | `DATABASE=local`, and no AWS credentials on the machine | The dev server starts with no "Not logged in to AWS" line. Every route works |
| Dev, logged in | `DATABASE=dev`, after `aws login` | `GET /api/todos` returns the Todos in the real `tdl-dev-todos` table |
| Dev, not logged in | `DATABASE=dev`, and no AWS credentials | The dev server prints `NOT_LOGGED_IN_MESSAGE` at startup, as today |

Also checked, nothing to decide: two developers at once (each machine has its own DynamoDB Local), old data (the dev table is unchanged).

➡️ Yes, all five results are right.

**Answer:**
Yes

---

❓ **Q2** - **Rules 4 to 6: `pnpm dev`**: Are these results right?

| Scenario | Given | Then |
| --- | --- | --- |
| Start | DynamoDB Local is installed. You run `pnpm dev` | The terminal shows the frontend on 9000, the API on 3000, and DynamoDB Local on 8000 |
| Stop | `pnpm dev` runs. You press Ctrl+C | All three stop. Ports 9000, 3000 and 8000 are free |
| Not installed | DynamoDB Local's folder is missing. You run `pnpm dev` | The terminal shows Java's error, `Unable to access jarfile …`. The frontend and the API keep running |
| Port taken | Another program uses port 8000. You run `pnpm dev` | The terminal shows DynamoDB Local's error. The frontend and the API keep running |
| Data kept | You add "Buy milk", stop `pnpm dev`, and start it again | The list still has "Buy milk" |

Also checked, nothing to decide: `DATABASE=dev` with DynamoDB Local running (DynamoDB Local runs unused), Windows itself (the start is a plain `java` command).

➡️ Yes, all five results are right.

**Answer:**
Yes

---

❓ **Q3** - **Rules 7, 8 and 10: what the reset does**: Are these results right?

| Scenario | Given | Then |
| --- | --- | --- |
| Reset after changes | The list has "Buy milk", and you deleted "Read for 1 hour" | After the reset, the list has exactly the six Demo Todos, and no "Buy milk" |
| Reset twice | You run the reset two times in a row | The list has the same six Todos, with the same IDs, both times |
| First reset | DynamoDB Local has no todos table | The reset creates the table and writes the six Demo Todos |
| Reset with dev selected | `DATABASE=dev`, and no AWS credentials | The reset changes the local table only. The dev table in AWS is unchanged. No AWS error appears |
| The order | After a reset, you open the Home Page | The list shows, from the top: "Complete online JavaScript course" (completed), "Jog around the park 3x", "10 minutes meditation", "Read for 1 hour", "Pick up groceries", "Complete Todo App on Frontend Mentor" |

Also checked, nothing to decide: the reset while the Home Page is open (the page shows the new list on its next load), another Owner's Todos (the local table has only the Demo Owner).

➡️ Yes, all five results are right.

**Answer:**
Yes

---

❓ **Q4** - **Rule 9: the reset starts DynamoDB Local**: Are these results and messages right?

| Scenario | Given | Then |
| --- | --- | --- |
| Not running | `pnpm dev` is stopped. You run `pnpm db:reset` | The reset prints `DynamoDB Local isn't running. Starting it…`, then `Reset tdl-dev-todos: 6 Todos written.`, then `Stopped DynamoDB Local.` Port 8000 is free afterward |
| Running | `pnpm dev` runs. You run `pnpm db:reset` | The reset prints only `Reset tdl-dev-todos: 6 Todos written.` DynamoDB Local keeps running |
| Can't start | DynamoDB Local isn't installed. You run `pnpm db:reset` | After 10 seconds, the reset prints `DynamoDB Local didn't answer within 10 seconds. Is it installed? See docs/local-development.md.` and exits with code 1. Nothing changes |

Also checked, nothing to decide: Ctrl+C during the reset (Java stops with the reset, because it is the reset's child process).

➡️ Yes, all three results are right.

**Answer:**
Results are mostly right, but I feel like, along with referring the user to local-development.md, we should also point out that the setup script exists and maybe you forgot to run the setup script

---

❓ **Q5** - **Rule 11: before the first reset**: Is this result right?

| Scenario | Given | Then |
| --- | --- | --- |
| No table yet | DynamoDB Local runs, and no reset has run yet | `GET /api/todos` answers 500 with `{"message":"Internal Server Error"}`. The terminal shows `ResourceNotFoundException`. The Home Page shows its red alert, "Could not load your todos." (`Home.tsx`, line 87) |

Today `router.ts` logs the error and throws it again, and `dev/server.ts` answers 500.

➡️ Yes.

**Answer:**
The rule is correct, but I wonder if there's a way we can remind the developer to run the setup before they first serve, or as they first serve, like in the same place where they know to run pnpm install

---

❓ **Q6** - **Rule 12: the setup script**: Are these results right?

| Scenario | Given | Then |
| --- | --- | --- |
| Fresh machine | No Java and no DynamoDB Local | The script asks for your `sudo` password, installs Java, then downloads and unpacks DynamoDB Local |
| Java already there | Java is installed, DynamoDB Local isn't | The script only downloads and unpacks DynamoDB Local |
| Both there | Java and DynamoDB Local are installed | The script prints `Java and DynamoDB Local are installed.` and changes nothing |

Also checked, nothing to decide: an old Java version (round 4: the script checks only that `java` exists), a failed download (Bash stops at the first failed command).

➡️ Yes, all three results are right.

**Answer:**
Yes

---

❓ **Q7** - **Rules 13 and 14: the removed route and the hidden link**: Are these results right?

| Scenario | Given | Then |
| --- | --- | --- |
| Removed route | You send `POST http://localhost:3000/api/demo-todos/restore` | 404 with `{"message":"Not Found"}` |
| Hidden link | You open the Home Page | The text "Restore demo todos" doesn't show |

➡️ Yes, both results are right.

**Answer:**
Yes

---

❓ **Q8** - **A missing or unknown database setting**: The deployed Lambda gets only `TODOS_TABLE` and `NODE_OPTIONS` (`infra/modules/app/main.tf`, line 88). So in the Lambda, `DATABASE` is missing, and the Lambda must use the real DynamoDB. Your own `api/.env` also lacks `DATABASE` until you add it. Are these results right?

| Scenario | Given | Then |
| --- | --- | --- |
| Missing | No `DATABASE` | The API uses the real DynamoDB in AWS, as today |
| Local | `DATABASE=local` | The API uses DynamoDB Local |
| Dev | `DATABASE=dev` | The API uses the real DynamoDB in AWS |
| Unknown | `DATABASE=prod`, or any other value | The API stops at startup with `DATABASE must be local or dev`, as for a missing `TODOS_TABLE` |

➡️ Yes, all four results are right.

**Answer:**
I don't like that default. I wanted to check for a database setting and, if it doesn't exist, refuse to run

---

❓ **Q9** - **How each case gets checked**: The unit tests mock the repository, and no test runs against DynamoDB Local (round 1). So most cases get a manual check. Is this split right?

- **Automated tests:**
  - The hidden link (Q7): a Home Page test checks that "Restore demo todos" isn't visible.
  - The removed route (Q7): a router test checks that `POST /api/demo-todos/restore` has no route.
  - The setting (Q8): a test checks which endpoint the DynamoDB client gets for each `DATABASE` value.
- **Manual checks:** every other case in Q1 to Q6, as steps in the feature's closing check.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q10** - **Builder's discretion**: The builder decides these alone, with the values below. Do you want to set any of them yourself?

- **The setting:** `DATABASE` in `api/.env`, with `local` or `dev`. `api/.env.example` sets `local`, with a comment.
- **DynamoDB Local's port:** a fixed 8000, written in the start command, the client and the reset. No new variable.
- **DynamoDB Local's folder:** `api/.dynamodb-local/`, ignored by git. The data goes in `api/.dynamodb-local/data/`.
- **One data file:** DynamoDB Local starts with `-sharedDb`. Without that flag, it keeps separate data for each access key and region, so the API and the reset could see different tables.
- **The fake credentials:** access key `local`, secret `local`, region `local`.
- **The download:** AWS's link to the latest version, `dynamodb_local_latest.tar.gz`, not a pinned version.
- **The file names:** `bin/setup-local-db.sh` for the setup script, and `api/dev/reset-local-db.ts` for the reset. The root command is `pnpm db:reset`.
- **The seed IDs:** six fixed IDs in the UUIDv7 form, so they look like real IDs. The IDs grow smaller down the list, because the list shows the largest ID first.
- **The wait limit:** the reset waits 10 seconds at most for DynamoDB Local to answer.

Everything else, the builder decides alone.

➡️ Yes, keep all nine values.

**Answer:**
Yes

---
