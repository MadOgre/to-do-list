# Spec review: ticket 02, install DynamoDB Local and start it with `pnpm dev`

Commit: 9a94721. Rulings: none. I judged the diff against the ticket's acceptance criteria.

## Findings

None.

## What I checked

- **Setup script** (`bin/setup-local-db.sh`): the script checks only that `java` exists. It runs `sudo apt install -y openjdk-21-jre-headless` when `java` is missing, uses no other installer, and downloads and unpacks `dynamodb_local_latest.tar.gz` into `api/.dynamodb-local/` when the jar is missing. When both are present, the script prints `Java and DynamoDB Local are installed.` and exits. No `package.json` script runs it.
- **Start** (`api/package.json:6-8`): `dev:server` is the `nodemon` command, unchanged. `dev:db` is a plain `java` command, with no Bash, on the fixed port 8000, with `-sharedDb` and `-dbPath .dynamodb-local/data`. `dev` is `pnpm run --no-bail "/^dev:/"`. pnpm runs the scripts in `api/`, so the relative paths resolve. The frontend and API ports do not change. The diff adds no Docker, no in-memory mode, no port variable, no `db:start` and no "not installed" message.
- **Git ignore**: `.gitignore` ignores `api/.dynamodb-local/`.
- **Docs**: "First-time setup" has a new step 4 after `pnpm install`, with the setup script for WSL and Linux, and Java 17+ plus the download commands for every other system. "Running it" names DynamoDB Local on 8000. "Supported systems" is unchanged. Step 6, "Sign in to AWS", stays required. That is correct here, because the API still uses the dev table in this ticket.
- **Structure doc**: it names `bin/setup-local-db.sh`, `api/.dynamodb-local/` and the new scripts.
- **Tests**: the agreed seam is the manual check only. The diff adds no tests, so there is no seam drift and there are no tautological tests. No testing box is ticked.

## Notes, not findings

- The ticket's closing manual check is not in the diff. I could not confirm that every scenario is a step in it. The caller must confirm this when it gives the check to the developer.
- The script runs `apt install` without `apt update`, exactly as the ticket says. On a fresh WSL image with empty package lists, the "Fresh machine" scenario can fail with `Unable to locate package`. Watch for this in the manual check.
- The script's comment says "WSL and Ubuntu only", but the docs say "WSL and Linux". This is a wording difference only.
