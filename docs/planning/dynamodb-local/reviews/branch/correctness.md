# Correctness review: branch dynamodb-local

Base: 990a8f850c4dd3adb5a2f32e1a5a84b73c3856d7. Scope: the code, scripts and docs that a developer runs or follows. The rulings in `docs/planning/dynamodb-local/rulings.md` are applied. The WSL 1 taken-port behavior is not a finding.

No blocking findings.

## Paths checked and found correct

- `dynamoDbClientConfig`: only `"local"` changes the client. The deployed Lambda has no `DATABASE` and no Terraform file sets it, so production keeps the SDK defaults.
- `dev/server.ts` refuses a missing or unknown `DATABASE` before it imports nothing new. `usesAws` keeps the credentials check and messages to `dev`.
- `reset-local-db.ts`:
  - The reset always uses `dynamoDbClientConfig("local")`, so a `DATABASE=dev` in `api/.env` can't reach AWS.
  - The first reset (no table) catches `ResourceNotFoundException` only. Other errors propagate, and the `finally` stops the started DynamoDB Local.
  - A missing `java` command: Node's `onErrorNT` calls the handle's `onexit` with the negative errno, so `exitCode` is set and `stopDynamoDbLocal` doesn't wait forever on `exit`. A missing jar makes java exit with code 1, which also sets `exitCode`.
  - `isPortAnswering`: `events.once` rejects on the socket's `error` event (ECONNREFUSED), so the function returns `false`, and the socket is destroyed in every case.
- Seed: the fixed IDs pass `isValidTodoId` (`/^[a-zA-Z0-9-]{1,64}$/`) and the `z.string()` todo_id schema. Their v7 timestamps (Nov 2025) sort below new IDs, so new Todos show above the Demo Todos. The items have only the entity's attributes, so `listTodos` reads them the same way as Toolbox items.
- Removing the restore route: nothing in `infra/`, `frontend/src/`, `api/src/` or `api/tests/` refers to `restoreDemoTodos`, `useRestoreDemoTodos` or the `restored` outcome any more. The hidden link has no `onClick`, and `display="none"` takes it out of the tab order.

## Findings

### C1 (non-blocking): an interrupted download leaves a half-unpacked install that the script then reports as installed

- **Place:** `bin/setup-local-db.sh:20-24`, and the check at line 10.
- **Trigger:** the network drops in the middle of `curl -fsSL "$download_url" | tar -xz -C "$db_dir"` after `tar` has already written `DynamoDBLocal.jar`, but before it writes all of `DynamoDBLocal_lib/`. `pipefail` makes this run fail. The next run finds `java` and the jar at line 10, prints `Java and DynamoDB Local are installed.`, and exits 0.
- **Wrong result:** `pnpm dev` starts DynamoDB Local, but the first table access fails on the missing sqlite4java native library. Every todos route answers 500, and the setup script says that the install is complete. The developer must find and delete `api/.dynamodb-local/` by hand.
- **Fix:** unpack into a temp folder (`mktemp -d`), then move it into `api/.dynamodb-local/` only after `tar` succeeds. Or remove `$db_dir` in an `ERR` trap.

### C2 (non-blocking): the script installs Java without `apt update`

- **Place:** `bin/setup-local-db.sh:17`.
- **Trigger:** a fresh or long-unused WSL Ubuntu, whose package lists are empty or stale.
- **Wrong result:** `sudo apt install -y openjdk-21-jre-headless` fails with `Unable to locate package` or a 404 `Failed to fetch`. `set -e` stops the script before DynamoDB Local is downloaded. The README's "Fresh machine" path doesn't work at its first step.
- **Fix:** run `sudo apt update` before `sudo apt install` on line 17.

### C3 (non-blocking): any `java` counts as installed, also a Java older than 17

- **Place:** `bin/setup-local-db.sh:10` and `:15` (`command -v java`).
- **Trigger:** a machine that already has Java 11 or 8 on its `PATH` (for example, `default-jre` on Ubuntu 20.04 is Java 11). README.md and `docs/local-development.md` require Java 17 or newer.
- **Wrong result:** the script prints `Java and DynamoDB Local are installed.` or skips the Java step. Then `pnpm dev` and `pnpm db:reset` fail to start DynamoDB Local (`UnsupportedClassVersionError`). The reset reports `DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh?`, which points back at the script that accepted the old Java.
- **Fix:** read the major version from `java -version` and install `openjdk-21-jre-headless` when it is below 17. Or say in the script's output and in `docs/local-development.md` that the script doesn't check the version.

## Index

C1 | non-blocking | bin/setup-local-db.sh:24 | interrupted download leaves jar without lib → rerun says installed, DynamoDB Local fails
C2 | non-blocking | bin/setup-local-db.sh:17 | fresh WSL with stale apt lists → Java install fails, setup stops
C3 | non-blocking | bin/setup-local-db.sh:10 | Java older than 17 on PATH → accepted, DynamoDB Local doesn't start
