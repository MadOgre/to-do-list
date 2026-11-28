# Round 8 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded round 7 in `decisions.md`. The "Can't start" message in rule 9 now reads: `DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh? See docs/local-development.md.`

---

❓ **Q1** - **A reminder to run the setup**: In round 7, Q5, you asked for a reminder to run the setup "in the same place where they know to run pnpm install". Today that place is "First-time setup" in `docs/local-development.md`: step 3 is `pnpm install`. Which reminder does the feature add?

- A. **Docs only.** "First-time setup" gets two new steps after `pnpm install`: run `bin/setup-local-db.sh` (or the manual steps), then run `pnpm db:reset` once. Step 5, "Sign in to AWS", becomes a step for `DATABASE=dev` only.
- B. **Docs, plus a message from `pnpm dev`.** Option A. Also, when DynamoDB Local's folder is missing, `pnpm dev` prints `DynamoDB Local isn't installed. Run bin/setup-local-db.sh.` instead of Java's `Unable to access jarfile …`.
- C. **Docs, plus a message after `pnpm install`.** Option A. Also, a `postinstall` script in the root `package.json` prints a reminder after every `pnpm install`.

📏 **Scope:** Options B and C each add a small script.
   **Now:** B turns the start of DynamoDB Local into a short Node file, because a plain `java` command can't check for a folder. C prints the reminder on every install, also for developers who already ran the setup.
   **Follow-up:** A, now. The rule 9 message already names the setup script, so a missed setup shows up at the first reset. A later change can add B in about 10 lines.

➡️ A. The docs step sits right next to `pnpm install`, and the reset's message catches the rest.

**Answer:**
A is fine, no scope increase

---

❓ **Q2** - **Refuse to run without the setting**: In round 7, Q8, you asked that the API refuse to run when `DATABASE` is missing. One fact clashes. The deployed Lambda gets only `TODOS_TABLE` and `NODE_OPTIONS` (`infra/modules/app/main.tf`, line 88). If the API's own code refuses without `DATABASE`, the deployed Lambda fails on every request. Where does the refusal live?

- A. **In the dev server only.** `api/dev/server.ts` stops at startup unless `DATABASE` is `local` or `dev`, with the message `DATABASE must be local or dev (see api/.env.example)`. The Lambda's code sets the local address only when `DATABASE=local`, and otherwise works as today. No `.tf` file changes.
- B. **In the API's code, with a Terraform change.** The repository refuses without `DATABASE`. Terraform adds `DATABASE=dev` to the Lambda's variables. Later environments add their own values. You deploy the change with `pnpm deploy:dev`.

📏 **Scope:** Option B changes Terraform, which round 1 put out of scope.
   **Now:** Every place that runs the API states its database, the Lambda too. The feature changes a `.tf` file. The code and the Terraform change must go out in the same deploy, or the Lambda fails.
   **Follow-up:** A, now. The staging and production feature can add `DATABASE` to Terraform, when those environments exist.

➡️ A. It gives you the refusal on your machine and leaves the Lambda as it is.

**Answer:**
A

---
