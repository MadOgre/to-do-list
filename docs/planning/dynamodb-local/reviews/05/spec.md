# Spec review: ticket 05, the reset starts and stops DynamoDB Local

Commit: 18673ad. Base for provenance: 990a8f8.

## Findings

None.

## What was checked

- **The start** (`api/dev/reset-local-db.ts:78-112`): the arguments match `dev:db` in `api/package.json:8` exactly: port 8000, `-sharedDb`, `-dbPath .dynamodb-local/data`, `-disableTelemetry` (ruling 02). The start runs from `api/` with `spawn`, with no Bash (Invariant 7).
- **The wait** (`:114-124`): a TCP poll every 250 ms, for 10 seconds at most. The poll doesn't check what program answers, as the ticket's "Do not" asks.
- **The messages** (`:183`, `:176`, `:196`, `:198-200`): the literal texts match the "Not running" and "Can't start" scenarios. A missing jar or a missing `java` command still waits the full 10 seconds, then prints the error and sets exit code 1. The `error` listener stops a missing `java` from crashing the reset. Node's `onexit` sets `exitCode` to a negative errno, so `stopDynamoDbLocal` doesn't wait forever.
- **After a failure** (`:188-194`): `try/finally` stops the DynamoDB Local that the reset started, and waits for its `exit`. The error then propagates, and Node exits with code 1. The branch for a DynamoDB Local that runs already (`:180-181`) never stops DynamoDB Local.
- **A foreign program on port 8000**: the reset uses the program, the AWS SDK call fails, and the reset exits with code 1.
- **Never AWS**: `dynamoDbClientConfig("local")` is still the only client config (`:139`).
- **Docs**: `README.md`, `docs/local-development.md` and `docs/structure.md` describe the new behavior. The README now runs `pnpm db:reset` before `pnpm dev`, which follows from the ticket. This change is not scope creep.
- **Scenario tests**: the agreed seam is the running app, checked by hand. No `Test:` lines exist, so there is no automated test to check, and no seam drift.
- The unticked acceptance criteria (the closing manual check, the build checks) are process steps for `/implement`. The diff can't show whether they pass.
