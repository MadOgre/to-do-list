# Round 1 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

What I worked from: `INTENT.md`, `GLOSSARY.md`, `docs/adr/`, `docs/local-development.md`, `api/dev/server.ts`, `api/src/resources/todos/` and `infra/modules/app/dynamodb.tf`.

Facts that the questions use:

- Today the API always uses the real `tdl-dev-todos` table in AWS. `docs/local-development.md` ("First-time setup", step 5) tells you to run `aws login` first.
- `api/dev/server.ts` loads AWS credentials at startup. If they fail to load, the server prints `NOT_LOGGED_IN_MESSAGE`.
- The Demo Todos are `DEMO_TODOS` in `api/src/resources/todos/demo-todos.ts`. The route handler `restoreDemoTodos` (`route-handlers/restore-demo-todos.ts`) gives them new IDs each time.
- Java 21 (OpenJDK 21.0.13) is installed in this WSL. DynamoDB Local needs Java 17 or newer.

---

❓ **Q1** - **Outcome**: Is this the one sentence that says what is true for the developer when this feature ships?

A developer runs the whole app with `pnpm dev` against DynamoDB Local on their own machine. The table starts with the Demo Todos. The developer needs no AWS account, no `aws login` and no AWS CLI.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q2** - **Smallest useful version**: Is the list below the least that delivers the outcome?

1. One setup command downloads DynamoDB Local into the repo. Git ignores the download. If Java is missing or too old, the command stops and says how to install Java.
2. One command starts DynamoDB Local.
3. A seed step creates the todos table and fills it with the Demo Todos from `DEMO_TODOS`. The step uses Node and the AWS SDK that the API already has, not the AWS CLI.
4. A setting in `api/.env` sends the API's DynamoDB calls to DynamoDB Local. Locally, the setting is on by default.
5. `docs/local-development.md` explains the setup, and no longer needs `aws login` for local work.

➡️ Yes, the five items above.

**Answer:**
I want there to be a command in package.json in the root that will reset and reseed the local database only. Also, there is a dev version of the database online, so I should be able to select dev, in which case it will access the AWS table using AWS CLI. Also, this feature should delete the link that exists on a page that restores demo to-dos, and it should delete the API route that currently restores the demo to-dos. Essentially, demo to-dos should only exist as a local database seed and possibly a dev database seed. 

---

❓ **Q3** - **Out of scope**: Will this feature leave out each item below?

- The parameter to choose the staging or production database. `INTENT.md` says "eventually". The feature only keeps room for it.
- An automatic install of Java. The setup only explains how to install Java.
- DynamoDB Local in Docker.
- Changes to the deployed Lambda, to Terraform or to AWS.
- Tests that run against DynamoDB Local. The unit tests keep mocking the repository.
- Seed data other than the six Demo Todos.

➡️ Yes, leave out all six.

**Answer:**
yes

---

❓ **Q4** - **Invariants**: Must this feature keep each behavior below? Add or remove items in your answer.

1. The deployed Lambda calls the real DynamoDB, as today. `api/src/resources/todos/todos-repository.ts` builds `new DynamoDBClient()` with no endpoint.
2. The routes, their responses and their outcomes stay the same. Sources: `api/routes.json` and `api/src/resources/todos/route-handlers/`.
3. Restore Demo Todos still puts the six `DEMO_TODOS` in the list, in their order. Source: `restore-demo-todos.ts`.
4. The local table has the same keys as the real table: `owner_id` (partition key) and `todo_id` (sort key), both strings. Source: `infra/modules/app/dynamodb.tf`.
5. `pnpm dev` serves the frontend on port 9000 and the API on port 3000. Sources: `frontend/vite.config.ts`, `api/.env.example`.
6. The API's dev server listens on `localhost` only. Source: `app.listen` in `api/dev/server.ts`.
7. No unit test reaches DynamoDB. Source: `api/CLAUDE.md` and the `vi.mock` calls in `api/tests/`.
8. The same commands work on macOS, Linux, WSL and Windows itself. Source: "Supported systems" in `docs/local-development.md`.

➡️ Yes, keep all eight.

**Answer:**
1. Yes.
2. There will be a change in routes because one of the routes is getting deleted, which is the restore to-dos. See above. 
3. Restore demo todos will be deleted as a route and only exist as a PNPM command.
4. Yes, exactly the same, including the test user for any testing
5. Yes
6. yes 
7. yes

---

❓ **Q5** - **Extra rounds**: Will the session run each extra round below?

- **Scenarios round: yes.** A builder would otherwise decide some behaviors alone. Examples: Java is missing, DynamoDB Local isn't running when `pnpm dev` starts, and the seed step runs on a table that already has Todos.
- **Prior art question: yes.** `api/dev/server.ts` and `api/dev/invoke.ts` show how local tools run today. `restore-demo-todos.ts` shows how the Demo Todos go into the table. The question will say what to copy from each and what not to copy.

➡️ Yes, run both.

**Answer:**
yes

---
