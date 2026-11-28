# Round 9 questions: the final round

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded round 8 in `decisions.md`. The design tree has no open questions left.

---

❓ **Q1** - **The shared-understanding summary**: Is this summary right?

**The outcome.** A developer runs the whole app with `pnpm dev` against DynamoDB Local on their own machine. The table starts with the six Demo Todos. The developer needs no AWS account, no `aws login` and no AWS CLI.

**The install.** The developer installs Java and DynamoDB Local once per machine. On WSL and Linux, `bin/setup-local-db.sh` does both, with `apt` for Java and AWS's latest download for DynamoDB Local. On other systems, `docs/local-development.md` gives the manual steps. No `package.json` script runs the setup script. DynamoDB Local lives in `api/.dynamodb-local/`, which git ignores.

**Running.** `api/.env` sets `DATABASE` to `local` or `dev`. The dev server refuses to start without one of those two values. With `local`, the API talks to DynamoDB Local on port 8000 with fake credentials, and never mentions `aws login`. With `dev`, the API uses the real `tdl-dev-todos` table, as today. `pnpm dev` always starts DynamoDB Local next to the frontend and the API, with no Bash, so it still runs on Windows itself. If DynamoDB Local fails, the other two keep running. The local data survives restarts.

**The reset.** `pnpm db:reset` runs one TypeScript file with the AWS SDK. The reset deletes the local todos table, creates it again, and writes the Demo Todos from `api/dev/seeds/todos.ts`, with six fixed IDs. The reset starts DynamoDB Local itself when it isn't running, and stops it afterward. The reset always talks to DynamoDB Local, so it can't change AWS.

**The removal.** The feature deletes `POST /api/demo-todos/restore` and the code that only the route uses. The Restore Demo Todos link stays in `Home.tsx`, hidden, with its class, for a later use. You deploy the route removal yourself with `pnpm deploy:dev`. No `.tf` file changes.

**Deferred.** A reset of the dev table with a stern warning, a test user in the seed, a `pnpm dev` message when DynamoDB Local isn't installed, and `DATABASE` in Terraform.

**The invariants.** The deployed Lambda uses the real DynamoDB. The other routes, their responses and outcomes stay the same. The local table has the real table's keys. The ports stay 9000 and 3000. The dev server listens on `localhost` only. No unit test reaches DynamoDB.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q2** - **ADR candidates**: An ADR records a decision that is hard to reverse, surprising without context, and the result of a real trade-off. One decision meets all three tests:

- **Local work uses DynamoDB Local, a Java program, not Docker and not the AWS dev table.** Undoing this would change every developer's setup, the setup script, the docs, `pnpm dev` and the reset.

The other decisions fail at least one test. For example, the refusal in the dev server only is surprising, but easy to move later. The reset that names the todos table is easy to make generic later.

Do I write the one ADR, as `docs/adr/0002-dynamodb-local-for-local-work.md`?

➡️ Yes.

**Answer:**
Yes

---

❓ **Q3** - **The confirmation**: Is this the shared understanding?

➡️ Yes.

**Answer:**
Yes

---
