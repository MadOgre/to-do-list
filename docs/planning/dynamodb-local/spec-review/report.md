# Spec review report: dynamodb-local

## Round 1

- **Clean:** no
- **Reviewers:** a ran, b ran
- **Cost:** 83,263 tokens (a 42,226, b 41,037)

| Finding | Severity | Group | Outcome |
| --- | --- | --- | --- |
| Q1: reviewer A's summary | — | Ask | A: the summary matches the developer's intent |
| compare-1: "Can't start" predicted as "the spec doesn't say" (a, b) | Blocker | Fix | No edit. The real Then gives the message and exit code 1, from `decisions.md`, "Rule 9". The cleanup part goes to Q5 |
| compare-2: "Both there" predicted as "the spec doesn't say what the script prints" (a) | Blocker | Fix | No edit. The real Then gives `Java and DynamoDB Local are installed.`, from `decisions.md`, "Rule 12" |
| compare-3: "Port taken" predicted as "the spec doesn't say" (b) | Blocker | Ask | Q6: A. Added to "Also checked, nothing to decide" in Rules 4 to 6. Both reviewers matched the real Then on the error and the running servers. The open part is the API and the reset against a foreign program |
| compare-4: "Not running" predicts different messages (a: one per step, b: start, wait, reset, stop) | Blocker | Fix | No edit. The real Then gives the three literal messages, from `decisions.md`, "Rule 9" |
| compare-5: "Stop" predicted with "how Java surely stops" open (a, b) | Major | Contest, as builder's discretion | How Ctrl+C stops the Java process is code. The real Then (all three stop, ports free) is the rule, and the manual check covers it |
| OQ1 = a-F1, b-F5: the API's credentials with `local` | Blocker | Ask | Q2: A. The function gives the endpoint and the fake credentials and region. The endpoint test checks all three |
| OQ2 = a-F6: `README.md` | Major | Ask | Q3: A. `README.md` changes. Added to "The docs" |
| OQ3 = a-F6: `docs/adding-and-removing-resources.md` | Major | Ask | Q4: A. The resources doc gets two rows. Added to "The docs" |
| a-F2, b-F3: how the reset knows that DynamoDB Local runs | Major | Contest, as builder's discretion | The probe is code: "Everything else, the builder decides alone." The behavior is in the Rule 9 scenarios. The foreign-program part goes to Q6 |
| b-F1: a foreign program on port 8000 | Blocker | Ask | Q6: A, see compare-3 |
| a-F3, b-F2, b-F4: the reset's cleanup after a failure | Major | Ask | Q5: A. The reset always stops its own DynamoDB Local, then exits with code 1. Added to "Reset Local Database and the Seed" |
| a-F4, b-F12: what the setup script checks to call DynamoDB Local "installed" | Major | Contest, as builder's discretion | The check is code. "DynamoDB Local's folder" is a Builder's Discretion entry. "A failed download" is under "Also checked, nothing to decide" |
| a-F5, b-F10: the hidden link and the test's matcher | Major | Contest, as builder's discretion | The matcher is how to check rule 14. The rule and the Then name the visible text "Restore demo todos" |
| a-F7, b-F6: the function for an unknown value, and `pnpm invoke` | Major | Fix | Added to "The database setting": only `local` gives the local address, and the function never throws. `pnpm invoke` follows the Lambda's code. Source: `decisions.md`, "The dev server refuses without `DATABASE`" |
| a-F8, b-F7: the root `pnpm dev`, script names, and Ctrl+C with Java | Major | Contest, as builder's discretion | The root `dev` script stays as today. Script names and process handling are code. The Rule 4 scenarios give the behavior |
| a-F9: the deployed route before `pnpm deploy:dev` | Major | Contest | Scope, Out of scope: "the next `pnpm deploy:dev` deletes the route from AWS. The developer runs that deploy." Until then, the deployed code is the old code, with the route |
| b-F8: an old `api/.env` with no `DATABASE`, and the reset with no `TODOS_TABLE` | Major | Contest, as builder's discretion | The refusal message names `api/.env.example`. The reset's error for a missing variable is code, with the Repository's check as prior art |
| b-F9: the parts that the deletion removes aren't listed | Major | Fix | Added the list to "Deleting the route". Source: `decisions.md`, "What the deletion removes", and the code of today |
| b-F11: the seed rows' `version` | Major | Fix | Added "Each seed row has `version` 1". Source: `restore-demo-todos.ts` of today |
| b-F13: Rule 11's Then isn't a value | Major | Contest | The real Then gives 500, `{"message":"Internal Server Error"}`, `ResourceNotFoundException` and the red alert. The reviewer saw the hidden copy |

## Round 2

- **Clean:** no. One Major finding (a-F1) needed a spec edit.
- **Reviewers:** a ran, b ran
- **Cost:** 79,905 tokens (a 42,526, b 37,379)

| Finding | Severity | Group | Outcome |
| --- | --- | --- | --- |
| compare-1: "Can't start" predicted with "the text isn't given" (a, b) | Blocker | Fix | No edit. The real Then gives the message and exit code 1. Only the hidden Then cell holds the text, so each round's reviewers can't see it |
| a-F1: what `pnpm dev` does when `DATABASE` is missing or unknown | Major | Fix | Added to "The dev server": the refusal works like the missing `PORT` check. `nodemon` waits, and a save of `api/.env` starts the server again. Source: the `dev` script in `api/package.json`, and `docs/local-development.md` |
| a-F2: the Home Page test and `display="none"` | Major | Contest | Settled in round 1 (a-F5, b-F10) |
| a-F3: the setup script's install check and the data folder | Major | Contest | Settled in round 1 (a-F4, b-F12) |
| b-F1: how the reset knows that DynamoDB Local runs | Major | Contest | Settled in round 1 (a-F2, b-F3) |
| b-F2: the reset's step messages and exit codes | Major | Fix | No edit. The real Thens of rule 9 give the three messages and exit code 1. A table that a failed reset leaves half done goes away with the next reset (rule 7) |
| b-F3: "Dev, not logged in" Then isn't a value | Major | Contest | The real Then gives `NOT_LOGGED_IN_MESSAGE` at startup. The reviewer saw the hidden copy |
| b-F4: `LOCAL_DB_PORT=8000` in the developer's own `api/.env` | Major | Contest, as builder's discretion | "DynamoDB Local's port: a fixed 8000 ... No new variable." `api/.env.example` has no such variable, and git ignores `api/.env` |
| b-F5: the reset with no `TODOS_TABLE` | Major | Contest | Settled in round 1 (b-F8) |
| b-F6: Ctrl+C and the Java process | Major | Contest | Settled in round 1 (compare-5) |
| b-F7: `AWS_ENDPOINT_URL` or `AWS_PROFILE` could steer the reset | Major | Contest | Rule 8 and the Guarantee: the reset always uses DynamoDB Local's address on `localhost`, with fake credentials. Settings in the client's own config win over the environment in the AWS SDK |
| b-F8: the "Not installed" text, and a second DynamoDB Local on port 8000 | Major | Contest | The real Then gives `Unable to access jarfile …`. "Port taken" covers every other program on port 8000 |
| b-F9: the seed array's order and the fixed UUIDv7 values | Major | Contest, as builder's discretion | "The seed IDs: six fixed IDs in the UUIDv7 form. The IDs grow smaller down the list" |
| b-F10: `README.md` for macOS and Windows | Major | Contest | The "Quick start" in `README.md` already says "Full details, on every OS: docs/local-development.md", and that doc gives the manual steps |

## End of review

The developer stopped after round 2 and accepted the open findings. No finding was open, so the spec's `## Open Questions` stays "None."

## Settled list

- compare-5, a-F8, b-F7: contested as builder's discretion. How `pnpm dev` stops the Java process, and the script names, are code.
- a-F2, b-F3: contested as builder's discretion. The probe that finds a running DynamoDB Local is code.
- a-F4, b-F12: contested as builder's discretion. The setup script's "installed" check is code.
- a-F5, b-F10: contested as builder's discretion. The Home Page test's matcher is how to check rule 14.
- a-F9: contested. The Out of scope line settles the deployed route.
- b-F8: contested as builder's discretion. The reset's error for a missing variable is code.
- b-F13: contested. Rule 11's real Then gives literal values.
- b-F4 (round 2): contested as builder's discretion. The port is a fixed 8000, with no variable.
- b-F7 (round 2): contested. Rule 8 and the Guarantee fix the reset's address and credentials.
- b-F9 (round 2): contested as builder's discretion. The seed IDs are a discretion entry.
- b-F10 (round 2): contested. `README.md` points to `docs/local-development.md` for every OS.
- b-F3, b-F8 (round 2): contested. The real Thens give literal values.
