# Round 4 questions

When you finish, tell Claude in chat that the answers are done.
Write "yes" to accept the recommended answer.

I recorded round 3 and the chat decisions in `decisions.md`. Q1 to Q3 replace the earlier Q1 and Q2 of this round.

---

❓ **Q1** - **How the setup script installs Java**: In chat, you asked for a small Bash script in `bin/` that installs Java and DynamoDB Local when they are missing. Installing Java needs a different command on each system. Which command does the script use?

- A. If `java` isn't found, the script runs `sudo apt install -y openjdk-21-jre-headless`. This command works on WSL and Ubuntu only. The script checks only that `java` exists, not its version.
- B. Option A, plus `brew install openjdk@21` on macOS.

➡️ A. It is the least that works on your machine.

**Answer:**
A

---

❓ **Q2** - **What the docs say about the install**: Does `docs/local-development.md` give both ways to install?

- On WSL and Linux: run the setup script.
- On every other system: two manual steps. Install Java 17 or newer, then download and unpack DynamoDB Local into the right folder. The docs show the download command.

➡️ Yes.

**Answer:**
Yes

---

❓ **Q3** - **A reset while `pnpm dev` is stopped**: DynamoDB Local runs only while `pnpm dev` runs. In round 3, Q7, you asked how complicated it is for the reset to start DynamoDB Local by itself. The answer is about 20 more lines of TypeScript. What does the reset do when DynamoDB Local isn't running?

- A. The reset stops with a message: start `pnpm dev` first. You run the reset once after the install, and later only when you want the Demo Todos back.
- B. The reset starts DynamoDB Local, waits until it answers, resets the table, and stops DynamoDB Local again.

➡️ A. You run the reset rarely, so the message is enough.

**Answer:**
B. The reset should not depend on whether or not it's running and should be able to start it by itself with appropriate messages to the user. 

---

❓ **Q4** - **The dev reset, now or later**: In round 2, Q8, you deferred the seed of the dev table. In round 3, Q8, you allowed a reset of the dev table, with a stern yes-or-no warning, for dev only. Does this feature add the dev reset, or does a follow-up?

One fact matters. Terraform manages the dev table (`infra/modules/app/dynamodb.tf`). So a dev reset must not delete the table and create it again: Terraform would lose track of the table. A dev reset would delete the Demo Owner's Todos and write the Demo Todos, as the deleted route did.

📏 **Scope:** Option A adds a second kind of reset, a warning prompt, and writes to AWS data.
   **Now:** You can refill the dev table as soon as the route is gone. The feature grows: the dev reset works differently from the local reset, and needs `aws login`.
   **Follow-up:** This feature stays local only. Until the follow-up, you can't refill the dev table. The follow-up costs little, because the Seed and the Demo Todos exist by then.

- A. This feature adds the dev reset.
- B. Defer the dev reset to a follow-up.

➡️ B. Your round 2 words: "All in all, it should be deferred to a feature later".

**Answer:**
B

---

❓ **Q5** - **The new name for the Demo Todos**: In round 3, Q10, you wrote that the Demo Todos will be called "local seeds". Two words clash with that name:

- "Local": the same six Todos may seed the dev table too.
- "Seed": `GLOSSARY.md` already uses **Seed** for the operation that fills a new table.

Which name does the glossary use for the six Todos?

- A. **Seed Todos**: the six Todos from the design that the Seed puts in a todos table. The code name becomes `SEED_TODOS`.
- B. **Local Seeds**, as you wrote.
- C. Keep **Demo Todos**.

The **Demo Owner** (`demo-owner`) keeps its name in every option.

➡️ A.

**Answer:**
I feel like I don't like this naming at all. Yes, colloquially, I might refer to them as local seeds or seed to-dos or whatever, but what I really, really want is a dedicated seeds folder, which will have each table by its table name. Well, not the exact table name, but maybe you'll have seeds.

The subfolder will be named to-dos, and inside of that, there will be an entire structure with demo owner and, underneath it, six to-dos. It'll be made in such a way that more seats can be added for more tables if need be. 

---
