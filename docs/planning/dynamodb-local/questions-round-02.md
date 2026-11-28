# Round 2 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

---

❓ **Q1** - **Deleting the route changes AWS**: In round 1 (Q3), you put "changes to the deployed Lambda, to Terraform or to AWS" out of scope. In Q2, you asked to delete the route `POST /api/demo-todos/restore`. Terraform makes one API Gateway route from each entry in `api/routes.json` (`infra/modules/app/main.tf`, line 20). So the next `pnpm deploy:dev` removes the route from AWS. No `.tf` file changes.

Is this the right way to settle the conflict?

- A. The feature deletes the route from the code and from `routes.json`. The feature changes no `.tf` file. You run `pnpm deploy:dev` yourself, when you choose.
- B. The feature also deploys the change to AWS, after your yes.
- C. The feature keeps the route.

➡️ A.

**Answer:**
A

---

❓ **Q2** - **What the deletion removes**: These files exist only for the Restore Demo Todos link and its route. Does the feature delete all of them?

- In `frontend/src/pages/Home/Home.tsx`: the link, `confirmRestore` and the confirm dialog. Also the `restoreLink` class in `Home.module.scss`.
- `useRestoreDemoTodos` in `frontend/src/api-hooks/todos.ts`, and `restoreDemoTodos` in `frontend/src/api/todos.ts`.
- The route's entry in `api/routes.json`, and its entry in `api/src/router/handler-registry.ts`.
- `api/src/resources/todos/route-handlers/restore-demo-todos.ts`, its test, and `api/dev/sample-events/todos/restore-demo-todos.json`.
- The outcome `restored` in `api/src/route-handler-tools/outcome-codes.ts`.
- `restoreDemoTodos` in `api/src/resources/todos/todos-repository.ts`, if the seed step doesn't use it.
- The lines about the route in `api/CLAUDE.md`, `frontend/CLAUDE.md` and `docs/structure.md`.

`DEMO_TODOS` stays, because the seed step uses it.

➡️ Yes, delete all of them.

**Answer:**
The actual link on that web page should probably just become hidden, and its class should stay for now, as later that link will be repurposed, or at least its style. For now, just hide it on the page. Everything else should get deleted.

Yes, as far as demo to-dos, they're going to become seeds for the new database, so perhaps they should be moved into seeds or somewhere like this. I'm not entirely sure. Ask me more questions about it, and let's hash this one out. 

---

❓ **Q3** - **What "dev" uses**: In round 1, you wrote that dev "will access the AWS table using AWS CLI". The API never calls the AWS CLI. The API uses the AWS SDK, with the credentials that `aws login` saves (`api/dev/server.ts`). Is this what you mean?

When you select dev, the API uses the real `tdl-dev-todos` table in AWS, as it does today. You need `aws login` first.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q4** - **How to select dev**: How do you choose between the local database and the dev table?

- A. One variable in `api/.env`, with the values `local` and `dev`. `api/.env.example` sets `local`. You edit the file to change it. The dev server restarts when `api/.env` changes.
- B. A second root command, for example `pnpm dev:aws`, next to `pnpm dev`.
- C. Both.

Later, staging and production can be more values of the same variable in A.

➡️ A.

**Answer:**
A

---

❓ **Q5** - **Does `pnpm dev` start DynamoDB Local**: In round 1, you accepted "one command starts DynamoDB Local". Which command is that?

- A. `pnpm dev` starts DynamoDB Local next to the frontend and the API, when the setting is `local`. Ctrl+C stops all three.
- B. A separate root command, for example `pnpm db:start`, in a second terminal. `pnpm dev` doesn't start DynamoDB Local.

➡️ A. The outcome says that you run the whole app with `pnpm dev`.

**Answer:**
A

---

❓ **Q6** - **What the reset does**: Is this what the reset command does?

The reset command deletes the local todos table, creates the table again, and fills the table with the six Demo Todos. The reset command never touches the dev table in AWS.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q7** - **Windows itself**: In round 1, Q4, your answer has no item 8. Item 8 says that the same commands work on macOS, Linux, WSL and Windows itself (`docs/local-development.md`, "Supported systems"). Does this feature keep that rule?

➡️ Yes. The new commands are Node scripts, so they run on every system.

**Answer:**
No, Node scripts are overcomplicating it. Use Bash whenever possible. I don't care that much about running on pure windows since I will be using bash and wsl whenever possible

---

❓ **Q8** - **Dev table seed**: In round 1, you wrote "possibly a dev database seed". Does the reset command also work on the dev table in AWS?

📏 **Scope:** Option A adds a command that deletes and writes data in AWS.
   **Now:** You can refill the dev table with the Demo Todos without the deleted route. The command needs `aws login`, and each run changes AWS data.
   **Follow-up:** This feature stays local only. After the route is gone, you can't refill the dev table from the app. A later feature can add the dev seed with little extra cost, because the seed code exists by then.

- A. Yes. The reset command works on the table that the setting selects.
- B. Defer to a follow-up.

➡️ B.

**Answer:**
I think this should be deferred, but here are my thoughts. I don't want any possibility of a seed script accidentally overwriting staging or production databases that will eventually exist. The dev database, however, does exist and will need to be seeded, but it would need to be some kind of a separate command, perhaps with some sort of a warning that says, "You're modifying a live database on dev."

Yes, I do want dev to be able to be seeded, but potentially with some kind of warning. I never want any of the other environments to be automatically seeded from this. All in all, it should be deferred to a feature later, but there should be no possibility of somebody accidentally connecting to dev and then running this seed command on dev just as easily. 


---

❓ **Q9** - **"Test user" in the glossary**: In round 1, Q4, you wrote "including the test user for any testing". `GLOSSARY.md` calls this person the Demo Owner: until the app has logins, every Todo has the same Owner. The code calls the Demo Owner `DEMO_OWNER_ID = "demo-owner"` (`todos-repository.ts`). Is the "test user" the Demo Owner?

➡️ Yes. The local Demo Todos belong to the Demo Owner, `demo-owner`.

**Answer:**
The local demo to-dos belong to the demo owner, like you said. However, the testing library used, I thought, a test user or something like this to save user to-dos for the end-to-end testing. I know that hasn't been implemented yet, but for the future, there might be a test user, and that should also be in the local database. 

---

❓ **Q10** - **"Seed" and "reset" in the glossary**: `GLOSSARY.md` lists "seed" under _Avoid_ for Demo Todos. `GLOSSARY.md` defines Restore Demo Todos as "Replacing every Todo of one Owner with the Demo Todos". In round 1, you used "reset", "reseed" and "seed". Which terms go in the glossary?

- A. Add the term **Reset Local Database**: deleting the local todos table, creating it again, and filling it with the Demo Todos. Remove the term Restore Demo Todos, because its route is gone. Keep "seed" under _Avoid_.
- B. Keep the term Restore Demo Todos for the new command.
- C. Allow "seed": add **Seed** as a term for the Demo Todos that go into a new table.

➡️ A.

**Answer:**
A but remove seed from avoid. Seed should be defined as part of the operation of resetting the local database. Resetting the local database includes calling on the seed operation, which seeds the data into the newly created database

---
