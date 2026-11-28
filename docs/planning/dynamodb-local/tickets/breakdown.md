# Ticket breakdown: dynamodb-local

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

The spec has 29 scenarios. Each scenario goes into exactly one ticket: the first ticket that makes the scenario observable at its seam.

## Tickets

### 01 - Delete the Restore Demo Todos route, and hide the link

- **Blocked by:** None
- **What it delivers:** `POST /api/demo-todos/restore` answers 404 like any unknown route, and the Home Page no longer shows the Restore Demo Todos link. The feature deletes every part that exists only for the route and the link. `DEMO_TODOS` stays until ticket 04 moves it to the seed file.
- **Scenarios (2):** Removed route, Hidden link.
- **Also:** the router test and the Home Page test from "Verified another way".

### 02 - Install DynamoDB Local, and start it with `pnpm dev`

- **Blocked by:** 01 (same file: `docs/structure.md`)
- **What it delivers:** `bin/setup-local-db.sh` installs Java and DynamoDB Local. `pnpm dev` starts DynamoDB Local on port 8000 next to the frontend and the API. The API still uses the dev table in AWS, as today. The docs get the install steps.
- **Scenarios (7):** Fresh machine, Java already there, Both there, Start, Stop, Not installed, Port taken.

### 03 - Select the database with `DATABASE`

- **Blocked by:** 02 (the "No table yet" and "Local" scenarios need DynamoDB Local running; same files: `docs/local-development.md`, `docs/structure.md`)
- **What it delivers:** `DATABASE=local` sends the API's DynamoDB calls to DynamoDB Local, with the fake credentials. `DATABASE=dev` uses the real dev table, with the login check of today. The dev server refuses a missing or unknown value. The deployed Lambda works as today.
- **Scenarios (8):** Dev, logged in, Dev, not logged in, Missing, dev server, Unknown, dev server, Local, Dev, Deployed Lambda, No table yet.
- **Also:** the endpoint test from "Verified another way".

### 04 - Reset Local Database with `pnpm db:reset`, while DynamoDB Local runs

- **Blocked by:** 03 (the API must read DynamoDB Local to show the seeded list; same files: `api/package.json`, `docs/local-development.md`, `docs/structure.md`)
- **What it delivers:** `pnpm db:reset` deletes the local todos table, creates it again, and writes the six Demo Todos from the seed file. This ticket covers the case where `pnpm dev` already runs DynamoDB Local. `README.md` and `docs/adding-and-removing-resources.md` get their changes.
- **Scenarios (10):** Local list, Local create, Local, no AWS login, Data kept, Reset after changes, Reset twice, First reset, Reset with dev selected, The order, Running.

### 05 - The reset starts and stops DynamoDB Local by itself

- **Blocked by:** 04 (same file: the reset)
- **What it delivers:** When DynamoDB Local isn't running, `pnpm db:reset` starts it, waits at most 10 seconds, resets the table, and stops it. After a failure, the reset stops the DynamoDB Local that it started, and exits with code 1.
- **Scenarios (2):** Not running, Can't start.

## Same-file chains

- **`docs/structure.md`:** 01 → 02 → 03 → 04 → 05. Each ticket that adds, moves or removes a file updates `docs/structure.md`, as the project's `CLAUDE.md` asks.
- **`docs/local-development.md`:** 02 → 03 → 04.
- **`api/package.json`:** 02 → 04.
- **The reset file:** 04 → 05.

Together, the chains make the order fully linear: 01, 02, 03, 04, 05. The only edge with no reason except a shared file is 01 → 02 (`docs/structure.md`).

## Prefactoring

None proposed. The one change to existing code that eases the feature is the new function that turns `DATABASE` into the client's settings. That function is a part of ticket 03, because ticket 03's endpoint test drives the function.

## Questions

❓ **Q1** - **Granularity**: Is the size of the tickets right, or too coarse, or too fine?

➡️ Right. Each ticket has one behavior that you can show on its own. Ticket 04 has 10 scenarios, above the hint of about 8. All 10 scenarios are manual steps against one small reset file, so ticket 04 still fits one builder.

**Answer:**


---

❓ **Q2** - **Blocking edges**: Is each edge right? Does each ticket wait only for tickets that really block it?

➡️ Yes, keep every edge. Edges 02 → 03 → 04 → 05 are real dependencies. Edge 01 → 02 exists only for `docs/structure.md`. Keep edge 01 → 02 anyway, because `/forge:implement` builds one ticket at a time, so the edge costs no time.

**Answer:**


---

❓ **Q3** - **Merge or split**: Should any tickets be merged or split? Ticket 04 is the largest, with 10 scenarios. A split by behavior would move "Local list", "Local create", "Local, no AWS login" and "Data kept" into a ticket of their own, blocked by 04. Those four scenarios check the app against the seeded table, not the reset itself.

➡️ No merge and no split. The four app scenarios need no new code after ticket 04. A separate ticket would only hold manual steps.

**Answer:**


---
