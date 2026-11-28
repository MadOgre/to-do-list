# Round 5 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded round 4 in `decisions.md`. These questions settle the seeds folder from your round 4, Q5 answer.

---

❓ **Q1** - **The layout of `todos`**: In round 3, you chose `api/dev/seeds/` for the seeds. In round 4, you asked for one subfolder for each table, and the Demo Owner's six Todos under `todos`. Which layout does the `todos` subfolder have?

- A. One file for each Owner: `api/dev/seeds/todos/demo-owner.ts`. The file holds the Demo Owner's six Todos, typed as `Todo` from `@to-do-list/common`. A later Owner, such as a test user, adds a file next to it.
- B. One file for the whole table: `api/dev/seeds/todos/todos.ts`. The file maps each Owner's ID to that Owner's Todos: `{ "demo-owner": [six Todos] }`.
- C. Option A, but as JSON files: `demo-owner.json`. JSON has no type check.

➡️ A.

**Answer:**
I like answer B, but I'm curious as to why there's a todos.ts file inside the todos folder. It seems to me that would be the only file inside the todos folder, in which case why not simply have todos.ts inside the seeds? Basically, one file per table. 

---

❓ **Q2** - **How the reset finds the seeds**: Does the reset name each seed file in its code?

- A. Yes. The reset imports `todos/demo-owner.ts` by name. A later seed file, or a later table, adds one line to the reset.
- B. No. The reset reads every subfolder and every file in `api/dev/seeds/` by itself, and finds the table and the Owner from the names.

➡️ A. It is the least code. Option B pays off only with many tables or Owners.

**Answer:**
I feel like option B is more future-proof here. However, I would want to make sure that the table names are correct locally, but I guess that would be taken care of just by the file name

---

❓ **Q3** - **The glossary names**: You don't like "Seed Todos" or "Local Seeds" as names. With the seeds folder, does the glossary stay as it is?

- **Demo Todos** keeps its name: the Demo Owner's six Todos from the design, in the seeds folder.
- **Seed** stays the name of the operation that fills a new table.
- "The seeds folder" is only a folder name, not a glossary term. So the word "seed" doesn't get a second meaning.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q4** - **The local table's name**: `api/.env` sets `TODOS_TABLE=tdl-dev-todos` (`api/.env.example`). The API reads the table name from `TODOS_TABLE` (`todos-repository.ts`). Does the local table in DynamoDB Local use the same name, `tdl-dev-todos`?

The local table and the dev table can share the name, because DynamoDB Local is a separate server. So switching between `local` and `dev` changes only the database setting, not `TODOS_TABLE`.

➡️ Yes, the same name.

**Answer:**
Yes

---
