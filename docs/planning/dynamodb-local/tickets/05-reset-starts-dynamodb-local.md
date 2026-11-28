# 05 - The reset starts and stops DynamoDB Local by itself

**Status:** todo
**Blocked by:** 04
**Model:** opus
**Skills:** None
**Pattern:** The reset, a `.ts` file in `api/dev/`: `api/dev/invoke.ts`: copy its header comment with a usage line, and how it runs (`node --env-file=.env` on a `.ts` file, from an `api/package.json` script); don't copy its Lambda handler and bundle code. The start of DynamoDB Local from Node: first of its kind, confirmed by the spec's Prior Art, which has no entry for a Node file that starts a process.

## What to build

The reset works whether `pnpm dev` runs or not. When DynamoDB Local isn't running, `pnpm db:reset` starts DynamoDB Local, waits until it answers, resets the table, and stops DynamoDB Local again. When DynamoDB Local runs already, the reset uses it and leaves it running, as today.

- **The start:** the reset starts DynamoDB Local with the same values as `pnpm dev`: port 8000, `-sharedDb`, `-disableTelemetry`, and the data folder in DynamoDB Local's folder. The start needs no Bash.
- **The wait:** the reset waits 10 seconds at most for DynamoDB Local to answer.
- **The messages:** the reset prints a short message for each step, with the literal texts in the scenarios below.
- **After a failure:** the reset always stops the DynamoDB Local that the reset started, also after a failure. Then the reset exits with code 1. The reset never stops a DynamoDB Local that was already running. The reason: a left-over Java process breaks the next `pnpm dev`.
- **A foreign program on port 8000:** nothing more to decide. The reset fails and exits with code 1. The developer frees the port.

## Seam under test

The running app, checked by hand: `pnpm db:reset` with `pnpm dev` stopped, and the terminal. These scenarios need a real DynamoDB Local, and no unit test runs against DynamoDB Local.

## Do not

- Don't stop with a message such as "start `pnpm dev` first". The reset must not depend on whether DynamoDB Local runs.
- Don't put Bash in the reset (Invariant 7).
- Don't check whether the program on port 8000 is DynamoDB Local.
- Don't stop a DynamoDB Local that the reset didn't start.
- Don't let any step reach the dev table in AWS. The reset always uses DynamoDB Local's address on `localhost`, with fake credentials.

## Testing acceptance criteria

### Rule 9: the reset starts DynamoDB Local

- [ ] **Not running**: given `pnpm dev` is stopped. The developer runs `pnpm db:reset`; then The reset prints `DynamoDB Local isn't running. Starting it…`, then `Reset tdl-dev-todos: 6 Todos written.`, then `Stopped DynamoDB Local.` Port 8000 is free afterward.
- [ ] **Can't start**: given DynamoDB Local isn't installed. The developer runs `pnpm db:reset`; then After 10 seconds, the reset prints `DynamoDB Local didn't answer within 10 seconds. Did you run bin/setup-local-db.sh? See docs/local-development.md.` and exits with code 1. Nothing changes.

## Acceptance criteria

- [ ] After a failure, no Java process that the reset started is left, and port 8000 is free.
- [ ] Every scenario above is a step in the closing manual check.
- [ ] The project's checks pass, as "Keep the build green" in the project's `CLAUDE.md` lists them.

## Notes

(Empty. `/forge:implement` adds notes here.)
