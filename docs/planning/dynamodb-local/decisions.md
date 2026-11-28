# Decisions: dynamodb-local

## Scope

### Outcome

- **Question:** Is this the one sentence that says what is true for the developer when this feature ships?
- **Decision:** A developer runs the whole app with `pnpm dev` against DynamoDB Local on their own machine. The table starts with the Demo Todos. The developer needs no AWS account, no `aws login` and no AWS CLI.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-01.md, Q1

### Smallest useful version

- **Question:** Is the list below the least that delivers the outcome?
- **Decision:** The five proposed items, plus the developer's three additions:
  1. A small Bash script in the root `bin/` folder installs Java and DynamoDB Local, if they are missing. Git ignores the DynamoDB Local download. No `package.json` script runs the setup script (see "The setup script").
  2. One command starts DynamoDB Local. That command is `pnpm dev` (see "`pnpm dev` always starts DynamoDB Local").
  3. A seed step creates the todos table and fills it with the Demo Todos. The step is TypeScript with the AWS SDK, not the AWS CLI (see "The reset uses TypeScript and the AWS SDK").
  4. A setting in `api/.env` sends the API's DynamoDB calls to DynamoDB Local. Locally, the setting is on by default.
  5. `docs/local-development.md` explains the setup, and no longer needs `aws login` for local work.
  6. A command in the root `package.json` resets and reseeds the local database only.
  7. The developer can select `dev`. Then the API uses the real dev table in AWS.
  8. The feature deletes the route `POST /api/demo-todos/restore` and the code that only the route uses. The feature hides the Restore Demo Todos link on the Home Page. The Demo Todos exist only as the seed of the local database. The reset of the dev table waits for a follow-up (see `## Deferred`).
- **Why:** The developer's words: "demo to-dos should only exist as a local database seed and possibly a dev database seed".
- **Rejected:** The five items alone.
- **Source:** questions-round-01.md, Q2

### Out of scope

- **Question:** Will this feature leave out each item below?
- **Decision:** The feature leaves out:
  - The parameter to choose the staging or production database. The feature only keeps room for it.
  - ~~An automatic install of Java.~~ Superseded by "The setup script": the setup script installs Java.
  - DynamoDB Local in Docker.
  - Changes to Terraform, and any deploy to AWS. The route deletion changes `api/routes.json`, so the next `pnpm deploy:dev` deletes the route from AWS. The developer runs that deploy (see "Deleting the route").
  - Tests that run against DynamoDB Local. The unit tests keep mocking the repository.
  - Seed data other than the six Demo Todos.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-01.md, Q3 and questions-round-02.md, Q1

### Extra rounds

- **Question:** Will the session run the scenarios round and the prior art question?
- **Decision:** Yes, both.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-01.md, Q5

## Invariants

- **Question:** Must this feature keep each behavior below?
- **Decision:**
  1. The deployed Lambda calls the real DynamoDB, as today. Source: `api/src/resources/todos/todos-repository.ts`.
  2. The routes, their responses and their outcomes stay the same, except that the feature deletes `POST /api/demo-todos/restore`. Source: `api/routes.json`.
  3. The local table has the same keys as the real table: `owner_id` (partition key) and `todo_id` (sort key), both strings. The local Demo Todos belong to the Demo Owner, `demo-owner`, as in the real table. Source: `infra/modules/app/dynamodb.tf`.
  4. `pnpm dev` serves the frontend on port 9000 and the API on port 3000.
  5. The API's dev server listens on `localhost` only. Source: `app.listen` in `api/dev/server.ts`.
  6. No unit test reaches DynamoDB.
- **Why:** The developer's answers. Restore Demo Todos stops being a route.
- **Rejected:** Keeping Restore Demo Todos as a route.
- **Also kept:** The same commands work on macOS, Linux, WSL and Windows itself (`docs/local-development.md`, "Supported systems"). `pnpm dev` and the reset need no Bash. Only the optional setup script is Bash. See "No Bash in `pnpm dev`".
- **Source:** questions-round-01.md, Q4 and questions-round-02.md, Q7 and Q9

## Deleting the route

### Deleting the route changes AWS

- **Question:** Deleting the route changes AWS. Is option A the right way to settle the conflict with the out-of-scope list?
- **Decision:** A. The feature deletes the route from the code and from `routes.json`. The feature changes no `.tf` file. The developer runs `pnpm deploy:dev`, when the developer chooses.
- **Why:** The developer accepted the recommendation.
- **Rejected:** B, the feature deploys the change. C, the feature keeps the route.
- **Source:** questions-round-02.md, Q1

### What the deletion removes

- **Question:** Does the feature delete every file part that exists only for the Restore Demo Todos link and its route?
- **Decision:** The feature deletes all of them, except two parts. The Restore Demo Todos link stays on the Home Page, hidden, for a later use. The `restoreLink` class in `Home.module.scss` stays. `DEMO_TODOS` moves (see "Where the Demo Todos go").
- **Why:** The developer's words: "later that link will be repurposed, or at least its style".
- **Rejected:** Deleting the link and its class.
- **Source:** questions-round-02.md, Q2

### How to hide the link

- **Question:** How does the feature hide the link?
- **Decision:** A. The `Anchor` stays in `Home.tsx`, with its text and its `restoreLink` class. The feature removes its `onClick` and adds Mantine's style prop `display="none"`. A comment says that the link waits for a new use.
- **Why:** The developer chose A.
- **Rejected:** B, the link's JSX as a comment.
- **Source:** questions-round-03.md, Q3

## Database selection

### What "dev" uses

- **Question:** When you select dev, does the API use the real `tdl-dev-todos` table, with the credentials from `aws login`?
- **Decision:** Yes. The API uses the AWS SDK, as today. The developer runs `aws login` first.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-02.md, Q3

### How to select dev

- **Question:** How do you choose between the local database and the dev table?
- **Decision:** A. One variable in `api/.env`, with the values `local` and `dev`. `api/.env.example` sets `local`. Later, staging and production can be more values of the same variable.
- **Why:** The developer accepted the recommendation.
- **Rejected:** B, a second root command such as `pnpm dev:aws`. C, both.
- **Source:** questions-round-02.md, Q4

### The dev server's login check

- **Question:** Does the dev server skip the AWS credentials check and `NOT_LOGGED_IN_MESSAGE` when the setting is `local`?
- **Decision:** Yes. With `local`, the dev server never mentions `aws login`. With `dev`, the check stays as today.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-03.md, Q9

### The API's fake credentials

- **Question:** Does the API use the fake credentials with `DATABASE=local`?
- **Decision:** A. Yes. With `local`, the new function gives the endpoint `http://localhost:8000` and the fake credentials and region. The endpoint test checks all three.
- **Why:** Without the fake credentials, the "Local, no AWS login" scenario can't pass.
- **Rejected:** B, only the endpoint, with the machine's own AWS credentials.
- **Source:** spec-review round-01, Q2

## Running DynamoDB Local

### `pnpm dev` starts DynamoDB Local

Superseded by "`pnpm dev` always starts DynamoDB Local".

- **Question:** Which command starts DynamoDB Local?
- **Decision:** A. `pnpm dev` starts DynamoDB Local next to the frontend and the API, when the setting is `local`. Ctrl+C stops all three.
- **Why:** The outcome says that the developer runs the whole app with `pnpm dev`.
- **Rejected:** B, a separate `pnpm db:start` in a second terminal.
- **Source:** questions-round-02.md, Q5

### `pnpm dev` always starts DynamoDB Local

- **Question:** Is the plan a manual install from the docs, no Bash anywhere, and `pnpm dev` always starts DynamoDB Local?
- **Decision:** A, with the setup script added (see "The setup script"). `pnpm dev` starts DynamoDB Local every time, even when `api/.env` says `dev`. The start is a plain `java` command, with no Bash.
- **Why:** A condition on the setting needs a script, and a script needs Bash. DynamoDB Local costs only a little memory when it isn't used.
- **Rejected:** B, start only with `local`, through a Bash script. C, an install script that the repo depends on.
- **Source:** chat discussion after Claude wrote questions-round-04.md

### No Bash in `pnpm dev`

- **Question:** (Same chat question.)
- **Decision:** `pnpm dev` and the reset command need no Bash, so they run on Windows itself too. "Supported systems" in `docs/local-development.md` stays as it is.
- **Why:** The developer's words: "I don't like to impose that limitation. It's just not the stuff I want to think about."
- **Rejected:** Bash scripts in `pnpm dev`, and dropping Windows itself.
- **Fact checked:** pnpm 10.34.5 runs every script that matches a pattern side by side: `pnpm run "/^dev:/"` started two test scripts at once. So the API's `dev` script can run the server and DynamoDB Local together, with no Bash and no new dependency. By default, pnpm stops the other scripts when one fails. With `pnpm run --no-bail "/^dev:/"`, the other scripts keep running.
- **Source:** chat discussion after Claude wrote questions-round-04.md

### The setup script

- **Question:** (Same chat question.)
- **Decision:** A small Bash script in the root `bin/` folder, with a name like "setup local database". The script checks for Java and installs it if it is missing. The script checks for DynamoDB Local and downloads and unpacks it if it is missing. The script has a minimum of error checks. No `package.json` script runs it: the script just sits in `bin/`. The script does nothing else.
- **Why:** The developer's words: "the most simplistic batch script you can think of, with a minimum of error checking, just to install these two things".
- **Rejected:** No script, only the docs. A setup command in `package.json`.
- **Source:** chat discussion after Claude wrote questions-round-04.md

### How the setup script installs Java

- **Question:** Which command does the setup script use to install Java?
- **Decision:** A. If `java` isn't found, the script runs `sudo apt install -y openjdk-21-jre-headless`. The command works on WSL and Ubuntu only. The script checks only that `java` exists, not its version.
- **Why:** The developer accepted the recommendation.
- **Rejected:** B, also `brew` on macOS.
- **Source:** questions-round-04.md, Q1

### What the docs say about the install

- **Question:** Does `docs/local-development.md` give both ways to install?
- **Decision:** Yes. On WSL and Linux: run the setup script. On every other system: install Java 17 or newer, then download and unpack DynamoDB Local into the right folder. The docs show the download command.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-04.md, Q2

### `README.md` changes too

- **Question:** Does `README.md` change too?
- **Decision:** A. Yes. The "Quick start" runs `bin/setup-local-db.sh` and `pnpm db:reset` in place of `aws login`. "Prerequisites" names Java. "Scripts" gets `pnpm db:reset`.
- **Why:** Otherwise the first page of the repo tells a new developer to run `aws login`, which the feature makes unnecessary.
- **Rejected:** B, `README.md` stays as it is.
- **Source:** spec-review round-01, Q3

### The resources doc mentions the seed

- **Question:** Does `docs/adding-and-removing-resources.md` mention the seed?
- **Decision:** A. Yes. The doc gets one row for the seed file in `api/dev/seeds/`, and one row for the lines in the reset.
- **Why:** The doc's purpose is to list every place, and the reset becomes one of those places.
- **Rejected:** B, the next Resource's feature adds the rows.
- **Source:** spec-review round-01, Q4

### Bash, not Node

Superseded by "The reset uses TypeScript and the AWS SDK".

- **Question:** Does this feature keep the rule that the same commands work on macOS, Linux, WSL and Windows itself?
- **Decision:** No. The new commands are Bash scripts wherever possible. The new commands need not run on Windows itself.
- **Why:** The developer's words: "Node scripts are overcomplicating it". The developer uses Bash and WSL.
- **Rejected:** Node scripts for every new command.
- **Source:** questions-round-02.md, Q7

### The reset uses TypeScript and the AWS SDK

- **Question:** Which way does the reset command send its requests?
- **Decision:** B. One small TypeScript file sends the requests with the AWS SDK that the API already has. `node` runs the file directly.
- **Why:** The AWS docs show the CLI and the SDKs for DynamoDB Local, not raw HTTP. The API already uses the SDK. The developer's words: "I'm warming up to the TypeScript idea now".
- **Rejected:** A, `curl` in Bash: not documented by AWS, and it needs hand-made signed headers. The AWS CLI: every developer would install it.
- **Source:** questions-round-03.md, Q1, and the chat discussion about Q1

### Where DynamoDB Local keeps its data

- **Question:** Do the local Todos survive when you stop and start `pnpm dev`?
- **Decision:** A. Yes. DynamoDB Local keeps its data in a folder on disk, next to the download. Git ignores the folder. Only the reset command brings the Demo Todos back.
- **Why:** The developer chose A.
- **Rejected:** B, data in memory.
- **Source:** questions-round-03.md, Q6

## Reset and Seed

### Where the Demo Todos go

- **Question:** Where do the Demo Todos go?
- **Decision:** A. In a new folder, `api/dev/seeds/`. The Lambda bundle no longer carries them. The layout inside the folder: see "The seeds folder".
- **Why:** Only the API uses the database. The SDK is in `api/package.json`. `api/dev/` already holds the local tools. The root `package.json` calls the API's script, as `deploy:dev` does.
- **Rejected:** B, stay in `api/src/resources/todos/`. C, a new root folder.
- **Source:** questions-round-03.md, Q4, and the chat discussion about Q4

### The Demo Todos' IDs

- **Question:** Do the Demo Todos get fixed IDs in the seed file?
- **Decision:** Yes. The IDs are in the list's order, so the list shows the Demo Todos in the design's order. Each reset puts the same six IDs back.
- **Why:** The developer accepted the recommendation.
- **Rejected:** New UUIDv7 IDs on each reset.
- **Source:** questions-round-03.md, Q5

### What the reset does

- **Question:** Is this what the reset command does?
- **Decision:** Yes. The reset command deletes the local todos table, creates the table again, and fills the table with the six Demo Todos. The reset command never touches the dev table in AWS.
- **Why:** The developer accepted the recommendation.
- **Rejected:** None.
- **Source:** questions-round-02.md, Q6

### The reset never reaches AWS

Superseded by "Reset of the dev table" under `## Deferred`. The local reset still never reaches AWS in this feature.

- **Question:** Does the reset command also work on the dev table in AWS?
- **Decision:** No. No accidental step may let the reset reach the dev table, even when `api/.env` selects `dev`. A seed of staging or production must never exist.
- **Why:** The developer's words: "there should be no possibility of somebody accidentally connecting to dev and then running this seed command on dev just as easily".
- **Rejected:** A, the reset works on the table that the setting selects.
- **Source:** questions-round-02.md, Q8

### Glossary terms

- **Question:** Which terms go in the glossary?
- **Decision:** A, with one change. `GLOSSARY.md` now has **Reset Local Database** and **Seed**, and no longer has Restore Demo Todos. "Seed" is no longer under _Avoid_ for Demo Todos. Reset Local Database ends with the Seed.
- **Why:** The developer's words: "Resetting the local database includes calling on the seed operation".
- **Rejected:** B, keep Restore Demo Todos. C, Seed as a name for the Demo Todos.
- **Source:** questions-round-02.md, Q10

### The reset starts DynamoDB Local by itself

- **Question:** What does the reset do when DynamoDB Local isn't running?
- **Decision:** B. The reset starts DynamoDB Local, waits until it answers, resets the table, and stops DynamoDB Local again. The reset tells the developer what it does, with messages. If DynamoDB Local already runs, the reset uses it and leaves it running.
- **Why:** The developer's words: "The reset should not depend on whether or not it's running".
- **Rejected:** A, the reset stops with "start `pnpm dev` first".
- **Source:** questions-round-04.md, Q3, and the chat discussion about Q3

### The reset stops its own DynamoDB Local after a failure

- **Question:** What does the reset do after a failure?
- **Decision:** A. The reset always stops the DynamoDB Local that the reset started, also after a failure. Then the reset exits with code 1. The reset never stops a DynamoDB Local that was already running.
- **Why:** A left-over Java process breaks the next `pnpm dev`, and the developer would not know why.
- **Rejected:** B, the reset stops DynamoDB Local only after a successful reset.
- **Source:** spec-review round-01, Q5

### A foreign program on port 8000

- **Question:** What happens when another program uses port 8000?
- **Decision:** A. Nothing more to decide. The API's requests fail with a 500, and the reset fails and exits with code 1. The developer frees the port.
- **Why:** The case is rare, and DynamoDB Local's own error already names the port problem in the terminal.
- **Rejected:** B, the reset checks that the program on port 8000 is DynamoDB Local.
- **Source:** spec-review round-01, Q6

### The seeds folder

Superseded in part by "One seed file per table": no subfolder for each table.

- **Question:** Which name does the glossary use for the six Todos?
- **Decision:** None of the proposed names. A dedicated seeds folder holds one subfolder for each table, named after the table without its prefix: `todos`. Under `todos`, the seed groups the Todos by Owner: the Demo Owner, with the six Todos. A later table adds its own subfolder. (Open: the exact layout and the glossary name. See questions-round-05.md.)
- **Why:** The developer's words: "It'll be made in such a way that more seeds can be added for more tables if need be".
- **Rejected:** A, **Seed Todos**. B, **Local Seeds**.
- **Source:** questions-round-04.md, Q5

### One seed file per table

- **Question:** Which layout does the `todos` subfolder have?
- **Decision:** B, without the subfolder. One file for each table, directly in `api/dev/seeds/`: `api/dev/seeds/todos.ts`. The file maps each Owner's ID to that Owner's Todos: `{ "demo-owner": [six Todos] }`.
- **Why:** The developer's words: "Basically, one file per table." A folder that holds one file adds nothing.
- **Rejected:** A, one file for each Owner. C, JSON files. A subfolder for each table.
- **Source:** questions-round-05.md, Q1

### The reset names the todos table

- **Question:** Does the reset name the todos table in its code, or does a generic reset read every file in `api/dev/seeds/` by itself?
- **Decision:** A. The reset names the todos table in its code, with the keys `owner_id` and `todo_id`, and reads `api/dev/seeds/todos.ts`. A later table adds about 10 lines to the reset.
- **Why:** The developer's words: "I just want to make it as simple as possible and I'm not that worried about it being generic." A generic reset needs a seed file format with keys and plain rows, and the format would replace the layout grouped by Owner.
- **Rejected:** B, a generic reset. In round 5, Q2, the developer first chose B as "more future-proof".
- **Source:** questions-round-05.md, Q2 and questions-round-06.md, Q1, settled in chat

### The glossary names stay

- **Question:** With the seeds folder, does the glossary stay as it is?
- **Decision:** Yes. **Demo Todos** keeps its name: the Demo Owner's six Todos from the design. **Seed** stays the name of the operation that fills a new table. "The seeds folder" is only a folder name, not a glossary term.
- **Why:** The developer accepted the recommendation.
- **Rejected:** **Seed Todos**, **Local Seeds**.
- **Source:** questions-round-05.md, Q3

### The local table's name

- **Question:** Does the local table in DynamoDB Local use the same name, `tdl-dev-todos`?
- **Decision:** Yes. The reset and the API both read the name from `TODOS_TABLE` in `api/.env`. Switching between `local` and `dev` changes only the database setting.
- **Why:** DynamoDB Local is a separate server, so the two tables can share the name.
- **Rejected:** A separate name for the local table.
- **Source:** questions-round-05.md, Q4

## Confirmation

- **Question:** Is the summary in questions-round-09.md, Q1, the shared understanding?
- **Decision:** Yes. The developer also chose one ADR: `docs/adr/0002-dynamodb-local-for-local-work.md`.
- **Why:** The developer accepted the summary and the ADR candidate.
- **Rejected:** None.
- **Source:** questions-round-09.md, Q1 to Q3
- **Spec review:** A fresh reviewer's summary of the spec matches the developer's intent. Source: spec-review round-01, Q1.

## Startup checks

### The setup reminder

- **Question:** Which reminder to run the setup does the feature add?
- **Decision:** A, docs only. "First-time setup" in `docs/local-development.md` gets two new steps after `pnpm install`: run `bin/setup-local-db.sh` (or the manual steps), then run `pnpm db:reset` once. Step 5, "Sign in to AWS", becomes a step for `DATABASE=dev` only.
- **Why:** The developer's words: "A is fine, no scope increase". The reset's message also names the setup script.
- **Rejected:** B, a message from `pnpm dev` when the folder is missing. C, a `postinstall` reminder after every `pnpm install`.
- **Source:** questions-round-08.md, Q1

### The dev server refuses without `DATABASE`

- **Question:** Where does the refusal to run without `DATABASE` live?
- **Decision:** A. In the dev server only. `api/dev/server.ts` stops at startup unless `DATABASE` is `local` or `dev`, with `DATABASE must be local or dev (see api/.env.example)`. The Lambda's code sets the local address only when `DATABASE=local`, and otherwise works as today. No `.tf` file changes.
- **Why:** The deployed Lambda gets only `TODOS_TABLE` and `NODE_OPTIONS` (`infra/modules/app/main.tf`). A refusal in the API's own code would break every request to the Lambda.
- **Rejected:** B, a refusal in the repository, with `DATABASE=dev` added to the Lambda in Terraform. The developer's round 7 wish for "missing means AWS" on the developer's machine.
- **Source:** questions-round-07.md, Q8 and questions-round-08.md, Q2

## Deferred

### A message from `pnpm dev` when DynamoDB Local isn't installed

- **Decision:** A later change can make `pnpm dev` print `DynamoDB Local isn't installed. Run bin/setup-local-db.sh.` in place of Java's error.
- **Why:** The developer wanted no scope increase.
- **Cost to add later:** About 10 lines: the start becomes a short Node file that checks for the folder.
- **Source:** questions-round-08.md, Q1

### `DATABASE` in Terraform

- **Decision:** The staging and production feature can add `DATABASE` to each Lambda's variables in Terraform, and move the refusal into the API's code.
- **Why:** Only the dev environment exists today. A Terraform change was out of scope.
- **Cost to add later:** Small: one variable in `infra/modules/app/main.tf`, and one check moved from the dev server to the repository.
- **Source:** questions-round-08.md, Q2

### Reset of the dev table

- **Decision:** A later feature adds a reset of the dev table in AWS. The reset shows a stern warning and asks for yes or no, for example: "You're modifying a live database on dev." The reset works for dev only, never for staging or production. The dev reset must not delete the table, because Terraform manages the table. The dev reset deletes the Demo Owner's Todos and writes the Demo Todos.
- **Why:** The dev table exists and needs a seed. The developer wants no chance to run the dev reset by accident.
- **Cost to add later:** Small. The Seed code and the seeds folder exist by then.
- **Source:** questions-round-02.md, Q8 and questions-round-03.md, Q8 and questions-round-04.md, Q4

### Test User

- **Decision:** A later end-to-end testing feature can add a test user with its own Todos to the local database.
- **Why:** The developer expects a test user "for the future". End-to-end tests don't exist yet.
- **Cost to add later:** Small. The later feature adds the test user's Todos to the Seed.
- **Source:** questions-round-02.md, Q9 and confirmed in questions-round-03.md, Q11

## Prior Art

The developer accepted every row. Source: questions-round-06.md, Q2.

| New part | Closest existing code | What to copy | What not to copy |
| --- | --- | --- | --- |
| The reset, a `.ts` file in `api/dev/` | `api/dev/invoke.ts` | Its header comment with a usage line. How it runs: `node --env-file=.env` on a `.ts` file, from an `api/package.json` script. | Its Lambda handler and bundle code. |
| The seed file, `api/dev/seeds/todos.ts` | `DEMO_TODOS` in `api/src/resources/todos/demo-todos.ts` | The six titles, their `completed` values, and their order. | Nothing else: `DEMO_TODOS` has no IDs and no Owner. |
| The local address in the DynamoDB client | `todos-repository.ts`, where it reads `TODOS_TABLE` | The check that throws when a required variable is missing. | No other change to the repository. |
| The login check with `local` | `api/dev/server.ts`, `NOT_LOGGED_IN_MESSAGE` and `isCredentialsError` | The check itself, which stays for `dev`. | Nothing: this part changes existing code only. |
| The API's `dev` script, split into a server script and a DynamoDB Local script | The `dev` script in `api/package.json` | The whole `nodemon` command, unchanged, as the server script. | Nothing else. |
| The root reset command | `deploy:dev` in the root `package.json` | The call into the API with `pnpm --filter @to-do-list/api`. | The build and the Terraform step. |
| The setup script in `bin/` | None: the first of its kind. | | |
| The docs | "First-time setup" and "Settings" in `docs/local-development.md` | The numbered steps, and the table of variables. | Step 5, "Sign in to AWS", as a step that every developer needs. |

## Rules and Scenarios

The developer accepted these 14 rules as right and complete. Source: questions-round-06.md, Q3. Each rule's scenarios follow the list, from questions-round-07.md.

1. With the database setting `local`, every todos route reads and writes DynamoDB Local. Why: the developer needs no AWS account.
2. With `local`, the dev server never mentions `aws login`. With `dev`, the login check works as today. Why: a message about AWS is noise when AWS isn't used.
3. With `dev`, every todos route reads and writes the real `tdl-dev-todos` table, with the `aws login` credentials. Why: the dev table stays available for testing.
4. `pnpm dev` starts DynamoDB Local next to the frontend and the API, with either setting. Ctrl+C stops all three. Why: one command runs the whole app.
5. If DynamoDB Local fails to start, the frontend and the API keep running, and the terminal shows DynamoDB Local's error. Why: with `dev`, the developer can still work.
6. The local Todos survive a stop and a start of `pnpm dev`. Why: test data isn't lost.
7. The reset deletes the local todos table if it exists, and creates it with the keys `owner_id` and `todo_id`. Then the reset writes the seed rows, with the same six IDs each time. Why: a known start for every test.
8. The reset always talks to DynamoDB Local on `localhost`, with fake credentials, whatever the database setting says. Why: the reset can't change AWS by accident.
9. If DynamoDB Local isn't running, the reset starts it, waits, resets the table, and stops it. If DynamoDB Local runs already, the reset uses it and leaves it running. The reset prints a short message for each step. Why: the reset works whether `pnpm dev` runs or not.
10. After a reset, the Home Page shows the six Demo Todos in the design's order, with "Complete online JavaScript course" first and completed. Why: the list matches the design.
11. Before the first reset, the local table doesn't exist, and a todos route fails with a 500. The docs tell the developer to run the reset once after the install. Why: the least code, for a case that happens once per machine.
12. The setup script installs Java with `apt` if `java` isn't found, and downloads and unpacks DynamoDB Local if it isn't there. A second run is harmless. Why: one script for the one-time install.
13. `POST /api/demo-todos/restore` answers like any unknown route: 404 with `{"message":"Not Found"}`. Why: the route is gone.
14. The Restore Demo Todos link isn't visible on the Home Page. Why: the link waits for a new use.

### Rules 1 to 3: the database setting

Source: questions-round-07.md, Q1. Accepted.

| Scenario | Given | Then |
| --- | --- | --- |
| Local list | `DATABASE=local`, after a reset | `GET /api/todos` returns the six Demo Todos |
| Local create | `DATABASE=local`. The developer adds "Buy milk" on the Home Page | "Buy milk" is in DynamoDB Local. The dev table in AWS has no "Buy milk" |
| Local, no AWS login | `DATABASE=local`, and no AWS credentials on the machine | The dev server starts with no "Not logged in to AWS" line. Every route works |
| Dev, logged in | `DATABASE=dev`, after `aws login` | `GET /api/todos` returns the Todos in the real `tdl-dev-todos` table |
| Dev, not logged in | `DATABASE=dev`, and no AWS credentials | The dev server prints `NOT_LOGGED_IN_MESSAGE` at startup, as today |

Also checked, nothing to decide: two developers at once, old data.

### Rules 4 to 6: `pnpm dev`

Source: questions-round-07.md, Q2. Accepted.

| Scenario | Given | Then |
| --- | --- | --- |
| Start | DynamoDB Local is installed. The developer runs `pnpm dev` | The terminal shows the frontend on 9000, the API on 3000, and DynamoDB Local on 8000 |
| Stop | `pnpm dev` runs. The developer presses Ctrl+C | All three stop. Ports 9000, 3000 and 8000 are free |
| Not installed | DynamoDB Local's folder is missing. The developer runs `pnpm dev` | The terminal shows Java's error, `Unable to access jarfile …`. The frontend and the API keep running |
| Port taken | Another program uses port 8000. The developer runs `pnpm dev` | The terminal shows DynamoDB Local's error, except on WSL 1: there, DynamoDB Local can start and print no error. The frontend and the API keep running |
| Data kept | The developer adds "Buy milk", stops `pnpm dev`, and starts it again | The list still has "Buy milk" |

Also checked, nothing to decide: `DATABASE=dev` with DynamoDB Local running, Windows itself, a foreign program on port 8000 (spec-review round-01, Q6).

### Rules 7, 8 and 10: what the reset does

Source: questions-round-07.md, Q3. Accepted.

| Scenario | Given | Then |
| --- | --- | --- |
| Reset after changes | The list has "Buy milk", and "Read for 1 hour" is deleted | After the reset, the list has exactly the six Demo Todos, and no "Buy milk" |
| Reset twice | The developer runs the reset two times in a row | The list has the same six Todos, with the same IDs, both times |
| First reset | DynamoDB Local has no todos table | The reset creates the table and writes the six Demo Todos |
| Reset with dev selected | `DATABASE=dev`, and no AWS credentials | The reset changes the local table only. The dev table in AWS is unchanged. No AWS error appears |
| The order | After a reset, the developer opens the Home Page | The list shows, from the top: "Complete online JavaScript course" (completed), "Jog around the park 3x", "10 minutes meditation", "Read for 1 hour", "Pick up groceries", "Complete Todo App on Frontend Mentor" |

Also checked, nothing to decide: the reset while the Home Page is open, another Owner's Todos.

### Rule 9: the reset starts DynamoDB Local

Source: questions-round-07.md, Q4. Accepted, with the developer's change: the "Can't start" message also names the setup script.

| Scenario | Given | Then |
| --- | --- | --- |
| Not running | `pnpm dev` is stopped. The developer runs `pnpm db:reset` | The reset prints `DynamoDB Local isn't running. Starting it…`, then `Reset tdl-dev-todos: 6 Todos written.`, then `Stopped DynamoDB Local.` Port 8000 is free afterward |
| Running | `pnpm dev` runs. The developer runs `pnpm db:reset` | The reset prints only `Reset tdl-dev-todos: 6 Todos written.` DynamoDB Local keeps running |
| Can't start | DynamoDB Local isn't installed. The developer runs `pnpm db:reset` | After 10 seconds, the reset prints `DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh? See docs/local-development.md.` and exits with code 1. Nothing changes |

Also checked, nothing to decide: Ctrl+C during the reset.

### Rule 11: before the first reset

Source: questions-round-07.md, Q5. The developer accepted the rule. The reminder to run the setup is in the docs only: see "The setup reminder".

| Scenario | Given | Then |
| --- | --- | --- |
| No table yet | DynamoDB Local runs, and no reset has run yet | `GET /api/todos` answers 500 with `{"message":"Internal Server Error"}`. The terminal shows `ResourceNotFoundException`. The Home Page shows its red alert, "Could not load your todos." |

### Rule 12: the setup script

Source: questions-round-07.md, Q6. Accepted.

| Scenario | Given | Then |
| --- | --- | --- |
| Fresh machine | No Java and no DynamoDB Local | The script asks for the `sudo` password, installs Java, then downloads and unpacks DynamoDB Local. The script prints `Installing Java...`, `Downloading DynamoDB Local...` and `DynamoDB Local is installed in api/.dynamodb-local/.` |
| Java already there | Java is installed, DynamoDB Local isn't | The script only downloads and unpacks DynamoDB Local. The script prints `Downloading DynamoDB Local...` and `DynamoDB Local is installed in api/.dynamodb-local/.` |
| Both there | Java and DynamoDB Local are installed | The script prints `Java and DynamoDB Local are installed.` and changes nothing |

Also checked, nothing to decide: an old Java version, a failed download.

### Rules 13 and 14: the removed route and the hidden link

Source: questions-round-07.md, Q7. Accepted.

| Scenario | Given | Then |
| --- | --- | --- |
| Removed route | `POST http://localhost:3000/api/demo-todos/restore` | 404 with `{"message":"Not Found"}` |
| Hidden link | The developer opens the Home Page | The text "Restore demo todos" doesn't show |

### A missing or unknown database setting

Source: questions-round-07.md, Q8, and questions-round-08.md, Q2. The developer rejected "missing means AWS" for the dev server. The deployed Lambda never gets `DATABASE`, so only the dev server refuses.

| Scenario | Given | Then |
| --- | --- | --- |
| Missing, dev server | No `DATABASE` in `api/.env`. The developer runs `pnpm dev` | The dev server stops at startup with `DATABASE must be local or dev (see api/.env.example)` |
| Unknown, dev server | `DATABASE=prod`, or any other value | The dev server stops at startup with the same message |
| Local | `DATABASE=local` | The API uses DynamoDB Local |
| Dev | `DATABASE=dev` | The API uses the real DynamoDB in AWS |
| Deployed Lambda | No `DATABASE`, as `infra/modules/app/main.tf` sets today | The Lambda uses the real DynamoDB, as today |

## Verified Another Way

Source: questions-round-07.md, Q9. Accepted.

- **Automated tests:** the hidden link (a Home Page test) and the removed route (a router test). Another test checks the endpoint that the DynamoDB client gets for each `DATABASE` value, including no value.
- **Manual checks:** every other scenario in rules 1 to 12, as steps in the feature's closing check. No unit test runs against DynamoDB Local.

## Guarantees

- **The reset never writes to AWS.** Ensured by: the reset always uses DynamoDB Local's address on `localhost`, with fake credentials, and ignores `DATABASE`. If broken: trusted, no handling.

## Builder's Discretion

Source: questions-round-07.md, Q10. Accepted.

- **The setting:** `DATABASE` in `api/.env`, with `local` or `dev`. `api/.env.example` sets `local`, with a comment.
- **DynamoDB Local's port:** a fixed 8000, written in the start command, the client and the reset. No new variable.
- **DynamoDB Local's folder:** `api/.dynamodb-local/`, ignored by git. The data goes in `api/.dynamodb-local/data/`.
- **One data file:** DynamoDB Local starts with `-sharedDb`, so the API and the reset see the same tables.
- **The fake credentials:** access key `local`, secret `local`, region `local`.
- **The download:** AWS's link to the latest version, `dynamodb_local_latest.tar.gz`, not a pinned version.
- **The file names:** `bin/setup-local-db.sh` for the setup script, and `api/dev/reset-local-db.ts` for the reset. The root command is `pnpm db:reset`.
- **The seed IDs:** six fixed IDs in the UUIDv7 form. The IDs grow smaller down the list, because the list shows the largest ID first.
- **The wait limit:** the reset waits 10 seconds at most for DynamoDB Local to answer.

Everything else, the builder decides alone.

## Rulings during `/implement`

- **Ticket 02, DynamoDB Local's network address:** DynamoDB Local listens on `localhost` only, if DynamoDB Local has an option for that. If not, `docs/local-development.md` says that other machines on the network can reach DynamoDB Local on port 8000. Source: the developer's answer to review finding S1 of ticket 02.
- **Ticket 02, a taken port 8000 on WSL 1:** DynamoDB Local can start on a taken port 8000 and print no error. The "Port taken" scenario now says so, and `docs/local-development.md` gets one sentence about WSL 1. Source: the developer's closing manual check of ticket 02, step 8.
- **Ticket 02, the setup script's messages:** the script prints `Installing Java...` and `Downloading DynamoDB Local...` before those steps, and `DynamoDB Local is installed in api/.dynamodb-local/.` after an install. Source: the developer's request after the closing manual check of ticket 02.
- **Ticket 02, DynamoDB Local's metadata file and telemetry:** git ignores `api/dynamodb-local-metadata.json`. DynamoDB Local starts with `-disableTelemetry`, in `dev:db` and in the reset's start. Source: the developer's answers after the fix rounds of ticket 02.
