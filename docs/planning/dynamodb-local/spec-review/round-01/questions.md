# Spec review round 1 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

❓ **Q1** - **Does reviewer A's summary match what you want?**: Reviewer A read only the spec, and summarized the build like this:

> I add one variable, `DATABASE` (`local` or `dev`), to `api/.env`. With `local`, the Repository's DynamoDB client points at `localhost:8000`. With `dev`, or with no value (the Lambda), it works as today. A new exported function turns the value into the client settings.
>
> `api/dev/server.ts` refuses to start unless `DATABASE` is `local` or `dev`. With `local`, it skips the credentials check and the login message.
>
> `api/package.json` splits `dev` into a nodemon server script and a DynamoDB Local `java` script. `dev` runs both with `pnpm run --no-bail "/^dev:/"`. Data lives in `api/.dynamodb-local/data`, with `-sharedDb`.
>
> `api/dev/reset-local-db.ts` talks to `localhost:8000` with fake credentials. It starts DynamoDB Local if it isn't running. It drops and creates the table, writes six seed rows from `api/dev/seeds/todos.ts`, and stops DynamoDB Local only if it started it. The root script `pnpm db:reset` calls it.
>
> `bin/setup-local-db.sh` installs Java with apt and downloads DynamoDB Local.
>
> I delete the restore route, its handler, its tests, its sample event and its frontend API function and hook. The Restore link stays in `Home.tsx` with `display="none"`.
>
> I update the docs, and add three tests: a Home Page test, a router test and an endpoint-function test.

A. Yes, the summary matches.
B. No. Say what is wrong.

➡️ A. Reviewer B's summary says the same things, so the spec gives one clear picture.

**Answer:**
A

---

❓ **Q2** - **Does the API use the fake credentials with `DATABASE=local`?**: Today the Repository builds `new DynamoDBClient()` with no settings (`api/src/resources/todos/todos-repository.ts`). The AWS SDK needs some credentials for each request, also to DynamoDB Local. On a machine with no AWS credentials, the "Local, no AWS login" scenario fails without fake credentials. The spec gives the fake credentials (access key `local`, secret `local`, region `local`) only to the reset. Both reviewers found this gap.

A. Yes. With `local`, the new function gives the endpoint `http://localhost:8000` and the fake credentials and region. The endpoint test checks all three.
B. No. With `local`, the function gives only the endpoint. The API uses the machine's own AWS credentials, if any.

➡️ A. Without the fake credentials, the "Local, no AWS login" scenario can't pass.

**Answer:**
A

---

❓ **Q3** - **Does `README.md` change too?**: The "Quick start" in `README.md` runs `aws login` before `pnpm dev`. Its "Prerequisites" names the AWS CLI "for the API's AWS parts", and doesn't name Java. Its "Scripts" table has no `pnpm db:reset`. The decisions name only `docs/local-development.md`.

A. Yes. The "Quick start" runs `bin/setup-local-db.sh` and `pnpm db:reset` in place of `aws login`. "Prerequisites" names Java. "Scripts" gets `pnpm db:reset`.
B. No. `README.md` stays as it is.

➡️ A. Otherwise the first page of the repo tells a new developer to run `aws login`, which the feature makes unnecessary.

**Answer:**
A

---

❓ **Q4** - **Does `docs/adding-and-removing-resources.md` mention the seed?**: That doc lists every place that a new Resource touches, with templates. The reset names the todos table in its code, and a later table adds about 10 lines to the reset and its own seed file. The doc doesn't mention the reset or `api/dev/seeds/` today.

A. Yes. The doc gets one row for the seed file in `api/dev/seeds/`, and one row for the lines in the reset.
B. No. The doc stays as it is. The next Resource's feature adds the rows.

➡️ A. The doc's purpose is to list every place, and the reset becomes one of those places.

**Answer:**
A

---

❓ **Q5** - **What does the reset do after a failure?**: The spec settles the timeout: after 10 seconds with no answer, the reset prints `DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh? See docs/local-development.md.` and exits with code 1. The spec doesn't say what happens to a DynamoDB Local that the reset started itself, when a step fails. Examples: the start times out, or the table step fails. A Java process left behind holds port 8000, and the next `pnpm dev` then can't start DynamoDB Local.

A. The reset always stops the DynamoDB Local that the reset started, also after a failure. Then the reset exits with code 1. The reset never stops a DynamoDB Local that was already running.
B. The reset stops DynamoDB Local only after a successful reset. After a failure, the developer stops the Java process by hand.

➡️ A. A left-over Java process breaks the next `pnpm dev`, and the developer would not know why.

**Answer:**
A

---

❓ **Q6** - **What happens when another program uses port 8000?**: The "Port taken" scenario says that DynamoDB Local's error shows, and the frontend and the API keep running. Both reviewers asked what happens next. With `DATABASE=local`, the API then sends its requests to the other program. The reset could also take the other program for a running DynamoDB Local.

A. Nothing more to decide. The API's requests fail with a 500, and the reset fails and exits with code 1. The developer frees the port. Add "a foreign program on port 8000" to "Also checked, nothing to decide".
B. The reset checks that the program on port 8000 is DynamoDB Local, and prints a message that names port 8000.

➡️ A. The case is rare, and DynamoDB Local's own error already names the port problem in the terminal.

**Answer:**
A

---
