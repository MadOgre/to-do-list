# Round 3 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded rounds 1 and 2 in `decisions.md`. I also changed `GLOSSARY.md`: it now has **Reset Local Database** and **Seed**, and no longer has Restore Demo Todos.

---

❓ **Q1** - **How the reset talks to DynamoDB Local**: In round 1, Q2, you accepted a seed step in "Node and the AWS SDK". In round 2, Q7, you asked for Bash wherever possible. The reset must not use the AWS CLI. Which way does the reset command send its requests?

- A. A Bash script sends the requests with `curl`. DynamoDB Local answers plain HTTP requests with a JSON body. The Demo Todos sit in a JSON file, in the form that DynamoDB expects. No Node code.
- B. One small Node script sends the requests with the AWS SDK that the API already has. The script reads `DEMO_TODOS`.

Option A depends on one fact: DynamoDB Local must accept a request that has a fake signature. Before the spec, I will check this fact on a fresh download. If the check fails, I will tell you, and the decision goes back to you.

➡️ A. Option A keeps every new command in Bash, as you asked.

**Answer:**
Okay, after thinking about this, I actually like the TypeScript version better because it already uses the AWS SDK. I'm going to go back on my original idea of keeping every command in Bash, I think I'm warming up to the TypeScript idea now. 

---

❓ **Q2** - **`pnpm dev` on Windows itself**: In round 2, you chose that `pnpm dev` starts DynamoDB Local, and that the new commands are Bash scripts. So `pnpm dev` itself will need Bash, and will stop working on Windows itself. `docs/local-development.md` ("Supported systems") lists Windows itself today. Does the feature change "Supported systems" to macOS, Linux and WSL?

➡️ Yes.

**Answer:**
This question might change in light of my choice for question 1. Let me know if you still have questions. 

---

❓ **Q3** - **How to hide the link**: You asked to hide the Restore Demo Todos link and to keep its class. How does the feature hide the link?

- A. The `Anchor` stays in `Home.tsx`, with its text and its `restoreLink` class. The feature removes its `onClick` and adds Mantine's style prop `display="none"`. A comment says that the link waits for a new use.
- B. The feature turns the link's JSX into a comment. The `restoreLink` class stays in `Home.module.scss`.

➡️ A.

**Answer:**
A

---

❓ **Q4** - **Where the Demo Todos go**: Today `DEMO_TODOS` is in `api/src/resources/todos/demo-todos.ts`, inside the code that esbuild bundles into the Lambda. After the route goes, only the reset uses the Demo Todos. Where do the Demo Todos go?

- A. In a new folder, `api/dev/seeds/`. The Lambda bundle no longer carries them. `api/dev/` already holds the local tools (`server.ts`, `invoke.ts`).
- B. They stay in `api/src/resources/todos/`.
- C. In a new root folder, for example `seeds/`.

The file's format follows from Q1: a JSON file for A in Q1, a `.ts` file for B in Q1.

➡️ A.

**Answer:**
A

---

❓ **Q5** - **The Demo Todos' IDs**: Today `restoreDemoTodos` gives the Demo Todos new UUIDv7 IDs on each call. The list shows the largest ID first (`restore-demo-todos.ts`). Do the Demo Todos get fixed IDs in the seed file?

The IDs are in the list's order, so the list shows the Demo Todos in the design's order. Each reset puts the same six IDs back.

➡️ Yes, fixed IDs.

**Answer:**
Yes, fixed IDs. 

---

❓ **Q6** - **Where DynamoDB Local keeps its data**: Do the local Todos survive when you stop and start `pnpm dev`?

- A. Yes. DynamoDB Local keeps its data in a folder on disk, next to the download. Git ignores the folder. Only the reset command brings the Demo Todos back.
- B. No. DynamoDB Local keeps its data in memory. Each start of `pnpm dev` begins with no table.

➡️ A.

**Answer:**
A

---

❓ **Q7** - **The first table, and a reset without `pnpm dev`**: DynamoDB Local runs only while `pnpm dev` runs. What happens on the first run, and when you run the reset while `pnpm dev` is stopped?

- A. The docs tell you to run the reset command once, after your first `pnpm dev` start. If DynamoDB Local isn't running, the reset command stops with a message: start `pnpm dev` first.
- B. `pnpm dev` runs the Seed by itself when the table doesn't exist. The reset command starts DynamoDB Local by itself when it isn't running.

➡️ A. It is the least that works.

**Answer:**
How complicated would it be to simply start DynamoDB local whenever a reset command is called? If it's not running, just start it up, do the reset, and then shut it down. 

---

❓ **Q8** - **How the reset stays away from AWS**: In round 2, you said that the reset must never reach the dev table by accident. Is this how the reset command makes sure?

The reset command always sends its requests to DynamoDB Local on `localhost`, with fake credentials. The reset command ignores the database setting in `api/.env`. So even with `dev` selected, the reset can't reach AWS.

➡️ Yes.

**Answer:**
I think I might have been a little hasty. I think that it's okay for it to reach the dev and AWS, but if it does so, it needs to put up a stern warning (reminding the user that it's about to modify a database remotely and asking to press yes or no). This should only work for dev, definitely not for any other environment. 

---

❓ **Q9** - **The dev server's login check**: At startup, `api/dev/server.ts` loads AWS credentials. If they fail to load, the server prints `NOT_LOGGED_IN_MESSAGE` ("Not logged in to AWS. Run `aws login`…"). The server prints the same message when a request fails for a credentials error. Does the dev server skip that check and that message when the setting is `local`?

➡️ Yes. With `local`, the dev server never mentions `aws login`. With `dev`, the check stays as today.

**Answer:**
Yes

---

❓ **Q10** - **Demo Todos after logins**: `GLOSSARY.md` says that the Demo Todos "exist only until the app has logins". Now the Demo Todos are the local seed. Does the feature remove that sentence from the glossary?

➡️ Yes. The Demo Todos stay the local seed after the app has logins.

**Answer:**
Yeah, demo to-dos are no longer going to be called demo to-dos. They're going to instead be called local seeds. They will exist for the foreseeable future, as seed for the local database and possibly seed for the remote dev database. 


---

❓ **Q11** - **The test user**: In round 2, Q9, you wrote that a future test user "should also be in the local database". End-to-end tests don't exist yet. I recorded the test user under `## Deferred` in `decisions.md`. Is that right?

➡️ Yes. The end-to-end testing feature adds the test user to the Seed.

**Answer:**
Yes

---
