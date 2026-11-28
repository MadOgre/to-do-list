# 02 - Install DynamoDB Local, and start it with `pnpm dev`

**Status:** done
**Blocked by:** 01
**Model:** opus
**Skills:** None
**Pattern:** The setup script in `bin/`: first of its kind, confirmed by the spec's Prior Art ("The setup script in `bin/`: the first of its kind"). The `dev` script in `api/package.json`: copy the whole `nodemon` command, unchanged, as the server script; don't copy anything else. "First-time setup" and "Settings" in `docs/local-development.md`: copy the numbered steps, and the table of variables; don't copy step 5, "Sign in to AWS", as a step that every developer needs.

## What to build

A developer installs Java and DynamoDB Local with one script, then runs `pnpm dev`. `pnpm dev` starts DynamoDB Local on port 8000, next to the frontend on 9000 and the API on 3000. Ctrl+C stops all three. If DynamoDB Local fails to start, the frontend and the API keep running.

- **The setup script:** a small Bash script, `bin/setup-local-db.sh`, with a minimum of error checks. If `java` isn't found, the script runs `sudo apt update`, then `sudo apt install -y openjdk-21-jre-headless`. The script checks only that `java` exists, not its version. If DynamoDB Local is missing, the script downloads AWS's `dynamodb_local_latest.tar.gz` and unpacks it into DynamoDB Local's folder. The script does nothing else. No `package.json` script runs the setup script.
- **DynamoDB Local's folder:** `api/.dynamodb-local/`, ignored by git. The data goes in its `data/` folder, and survives a stop and a start.
- **The start:** the API's `dev` script splits into a server script (the `nodemon` command, unchanged) and a DynamoDB Local script. The DynamoDB Local script is a plain `java` command, with no Bash, on port 8000, with `-sharedDb`, `-disableTelemetry` and the data folder. The API's `dev` script runs both with `pnpm run --no-bail "/^dev:/"`. `pnpm dev` starts DynamoDB Local every time, whatever the database setting says.
- **The docs:** `docs/local-development.md` gives both ways to install. On WSL and Linux: run the setup script. On every other system: install Java 17 or newer, then download and unpack DynamoDB Local into the right folder. The docs show the download command. "First-time setup" gets a step after `pnpm install`: run the setup script, or the manual steps. "Running it" names DynamoDB Local on port 8000. "Supported systems" stays as it is.

The API still uses the dev table in AWS in this ticket. A later ticket adds the database setting.

## Seam under test

The running app, checked by hand: the setup script, `pnpm dev`, and the terminal. These scenarios need a real DynamoDB Local, and no unit test runs against DynamoDB Local.

## Do not

- Don't put Bash in `pnpm dev`. Don't start DynamoDB Local only with `local` through a Bash script. `pnpm dev` and the reset must run on Windows itself too (Invariant 7).
- Don't add a setup command to `package.json`. The setup script just sits in `bin/`.
- Don't add a separate `pnpm db:start` for a second terminal.
- Don't use Docker, and don't keep DynamoDB Local's data in memory.
- Don't add a variable for the port. The port is a fixed 8000.
- Don't add `brew` or any other installer than `apt` to the setup script.
- Don't add a message from `pnpm dev` when DynamoDB Local isn't installed. That message is deferred.
- `pnpm dev` keeps the frontend on port 9000 and the API on port 3000 (Invariant 4).

## Testing acceptance criteria

### Rules 4 to 6: `pnpm dev`

- [x] **Start**: given DynamoDB Local is installed. The developer runs `pnpm dev`; then The terminal shows the frontend on 9000, the API on 3000, and DynamoDB Local on 8000.
- [x] **Stop**: given `pnpm dev` runs. The developer presses Ctrl+C; then All three stop. Ports 9000, 3000 and 8000 are free.
- [x] **Not installed**: given DynamoDB Local's folder is missing. The developer runs `pnpm dev`; then The terminal shows Java's error, `Unable to access jarfile …`. The frontend and the API keep running.
- [x] **Port taken**: given Another program uses port 8000. The developer runs `pnpm dev`; then The terminal shows DynamoDB Local's error, except on WSL 1: there, DynamoDB Local can start and print no error. The frontend and the API keep running.

### Rule 12: the setup script

- [ ] **Fresh machine**: given No Java and no DynamoDB Local; then The script asks for the `sudo` password, installs Java, then downloads and unpacks DynamoDB Local. The script prints `Installing Java...`, `Downloading DynamoDB Local...` and `DynamoDB Local is installed in api/.dynamodb-local/.`.
- [x] **Java already there**: given Java is installed, DynamoDB Local isn't; then The script only downloads and unpacks DynamoDB Local. The script prints `Downloading DynamoDB Local...` and `DynamoDB Local is installed in api/.dynamodb-local/.`.
- [x] **Both there**: given Java and DynamoDB Local are installed; then The script prints `Java and DynamoDB Local are installed.` and changes nothing.

## Acceptance criteria

- [x] Git ignores DynamoDB Local's folder, with its download and its data.
- [x] The structure doc names the setup script and DynamoDB Local's folder.
- [x] Every scenario above is a step in the closing manual check.
- [x] The project's checks pass, as "Keep the build green" in the project's `CLAUDE.md` lists them. The short `pnpm dev` start serves the frontend on port 9000 and the API on port 3000.

## Notes

Base: 73aca40f095ffec795eea3ae56edf34736deff49

Review round 1 (reviews/02/): Spec review: no findings.
- S1 (judgment, new, `api/package.json:8`): blocking, as a possible security exposure. The developer chose to fix S1 (ruling 02 in `rulings.md`).
- S2 (judgment, new, `docs/local-development.md:32`): non-blocking. Ticket 02 keeps the API on AWS. Ticket 03 rewrites step "Sign in to AWS" for `DATABASE=dev` only.
- Spec note, declined: the setup script runs `apt install` without `apt update`. The ticket asks for exactly that command.

Closing manual check, run by the developer: steps 1 to 7 passed. Step 8, "Port taken", showed no error from DynamoDB Local on WSL 1. Step 9, "Fresh machine", was not checked by hand.
- The orchestrator reproduced step 8: DynamoDB Local started on a port that Node held, on IPv6 and on IPv4 `0.0.0.0`.
- Two new rulings (`rulings.md`): the "Port taken" scenario names WSL 1, and the setup script prints its steps.

Close: the developer passed the second manual check (the new messages, the download path, and git ignoring both DynamoDB Local paths).
- Fixed: S1 (`ca44acb`), the WSL 1 port sentence and the setup messages (`3852ed3`), the metadata file and `-disableTelemetry` (`6df2d1a`).
- Accepted: S2, for ticket 03. Deferred: 0.
- Not checked by hand: "Fresh machine", and the message `Installing Java...`. The machine has Java, and the developer chose not to remove it.

For the next builders:
- `ss` doesn't work on this WSL 1. Check ports with `(exec 3<>/dev/tcp/127.0.0.1/<port>)`.
- On WSL 1, DynamoDB Local starts on a taken port 8000 with no error. A port check can't tell a stale DynamoDB Local from a new one.
- DynamoDB Local is installed in `api/.dynamodb-local/`. Never delete that folder.
- DynamoDB Local writes `api/dynamodb-local-metadata.json` into the folder where it runs. Git ignores that file in `api/` only. Ticket 05's reset must start DynamoDB Local from `api/`, or that file lands elsewhere.
- The API's log lines show as `api dev: . dev:server: …` and `api dev: . dev:db: …`.
