# Round 6 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded round 5 in `decisions.md`. Q1 settles a conflict between two round 5 answers. Q2 and Q3 are the prior art and rules questions that you accepted in round 1.

---

❓ **Q1** - **A reset that finds the seed files by itself**: In round 5, you chose one file for each table, `api/dev/seeds/todos.ts`, with the Todos grouped by Owner. You also chose a reset that reads every file in `api/dev/seeds/` by itself. The two answers clash, because a generic reset needs three facts about each table that the todos file doesn't give:

1. **The table's name.** The file name `todos` can lead to the variable `TODOS_TABLE`, and so to `tdl-dev-todos`. That rule is easy: file `<name>.ts` reads `<NAME>_TABLE` from `api/.env`. So your worry about the local table names is covered either way, because the API reads the same variable.
2. **The table's keys.** To create a table, the reset must know its partition key and sort key (`owner_id` and `todo_id` for todos). A file name can't say that.
3. **The shape of the items.** "Group by Owner" is a todos idea. A generic reset can't know that `demo-owner` goes into `owner_id`. So each file must give plain rows, each with all its keys.

So a generic reset needs each seed file to export a small table description. Which way does the feature go?

- A. **The reset names the todos table in its code.** `api/dev/seeds/todos.ts` keeps your layout: `{ "demo-owner": [six Todos] }`. The reset knows the todos table's keys, as Terraform does. A later table adds about 10 lines to the reset.
- B. **A generic reset.** Each seed file exports its keys and its rows, for example `{ keys: { partition: "owner_id", sort: "todo_id" }, rows: [...] }`. The todos file builds its rows from the Demo Owner's six Todos. The reset loops over every file in `api/dev/seeds/`. A later table adds only a file. The reset grows by about 15 lines now.

📏 **Scope:** Option B adds a seed file format and a loop over files, for one table.
   **Now:** A second table later needs no change to the reset. Every seed file must follow the format.
   **Follow-up:** A, now. When a second table comes, that feature can turn the reset generic. The change then costs about the same as B now, and the format can fit two real tables, not one.

➡️ A. Today the API has one table, and your goal is the least code that works.

**Answer:**
A (answered in chat)

---

❓ **Q2** - **Prior art**: For each new part, the table names the closest existing code, what to copy, and what not to copy. Is each row right?

| New part | Closest existing code | What to copy | What not to copy |
| --- | --- | --- | --- |
| The reset, a `.ts` file in `api/dev/` | `api/dev/invoke.ts` | Its header comment with a usage line. How it runs: `node --env-file=.env` on a `.ts` file, from an `api/package.json` script. | Its Lambda handler and bundle code. |
| The seed file, `api/dev/seeds/todos.ts` | `DEMO_TODOS` in `api/src/resources/todos/demo-todos.ts` | The six titles, their `completed` values, and their order. | Nothing else: `DEMO_TODOS` has no IDs and no Owner. |
| The local address in the DynamoDB client | `todos-repository.ts`, where it reads `TODOS_TABLE` | The check that throws when a required variable is missing. | No other change to the repository. |
| The login check with `local` | `api/dev/server.ts`, `NOT_LOGGED_IN_MESSAGE` and `isCredentialsError` | The check itself, which stays for `dev`. | Nothing: this part changes existing code only. |
| The API's `dev` script, split into a server script and a DynamoDB Local script | The `dev` script in `api/package.json` | The whole `nodemon` command, unchanged, as the server script. | Nothing else. |
| The root reset command | `deploy:dev` in the root `package.json` | The call into the API with `pnpm --filter @to-do-list/api`. | The build and the Terraform step. |
| The setup script in `bin/` | None. The repo has no `bin/` folder and no Bash script. | The first of its kind. | |
| The docs | "First-time setup" and "Settings" in `docs/local-development.md` | The numbered steps, and the table of variables. | Step 5, "Sign in to AWS", as a step that every developer needs. |

➡️ Yes, every row is right.

**Answer:**
yes

---

❓ **Q3** - **Rules**: These are the behaviors that the design makes true. Is each rule right, and is any rule missing?

1. With the database setting `local`, every todos route reads and writes DynamoDB Local. Why: you need no AWS account.
2. With `local`, the dev server never mentions `aws login`. With `dev`, the login check works as today. Why: a message about AWS is noise when AWS isn't used.
3. With `dev`, every todos route reads and writes the real `tdl-dev-todos` table, with your `aws login` credentials. Why: the dev table stays available for testing.
4. `pnpm dev` starts DynamoDB Local next to the frontend and the API, with either setting. Ctrl+C stops all three. Why: one command runs the whole app.
5. If DynamoDB Local fails to start, for example because it isn't installed, the frontend and the API keep running. The terminal shows DynamoDB Local's error. Why: with `dev`, you can still work. Fact checked: by default, pnpm stops the other scripts when one fails. pnpm's built-in `--no-bail` option keeps them running. I tested both in a scratch folder.
6. The local Todos survive a stop and a start of `pnpm dev`. Why: your test data isn't lost.
7. The reset deletes the local todos table if it exists, creates it with the keys `owner_id` and `todo_id`, and writes the seed rows. Each reset puts back the same six Todos with the same IDs. Why: a known start for every test.
8. The reset always talks to DynamoDB Local on `localhost`, with fake credentials, whatever the database setting says. Why: the reset can't change AWS by accident.
9. If DynamoDB Local isn't running, the reset starts it, waits until it answers, resets the table, and stops it again. If DynamoDB Local runs already, the reset uses it and leaves it running. The reset prints a short message for each step. Why: the reset works whether `pnpm dev` runs or not.
10. After a reset, the Home Page shows the six Demo Todos in the design's order: "Complete online JavaScript course" first, and completed. Why: the list matches the design.
11. Before the first reset, the local table doesn't exist. A todos route then fails with a 500, as any DynamoDB error does today. The docs tell you to run the reset once after the install. Why: the least code. The case happens once per machine.
12. The setup script installs Java with `apt` if `java` isn't found, and downloads and unpacks DynamoDB Local if it isn't there. If both are there, the script does nothing. A second run is harmless. Why: one script for the one-time install.
13. `POST /api/demo-todos/restore` answers like any unknown route: 404 with `{"message":"Not Found"}`. Why: the route is gone.
14. The Restore Demo Todos link isn't visible on the Home Page. Why: the link waits for a new use.

➡️ Yes, these rules are right and complete.

**Answer:**
yes

---
