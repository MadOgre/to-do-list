# Spec review: ticket 03, select the database with `DATABASE`

Commit: bc36c8c. Judged against ticket 03, the spec and the rulings. No ruling applies to this ticket.

## Findings

### P1 | partial | new | - | api/tests/database/dynamodb-client-config.test.ts:13-19

Criteria:
- "**Dev**: given `DATABASE=dev`; then The API uses the real DynamoDB in AWS."
- "**Deployed Lambda**: given No `DATABASE` ...; then The Lambda uses the real DynamoDB, as today."
- Ticket: "For `dev`, no value or any other value, the function gives the settings of today."

The checks:
- `expect(dynamoDbClientConfig("dev").endpoint).toBeUndefined();`
- `expect(dynamoDbClientConfig(undefined).endpoint).toBeUndefined();`

These checks cover only part of the Then. The tests would still pass if `dev` or no value got `region: "local"` or the fake credentials. With those settings, the client could not reach the real DynamoDB in AWS. The "settings of today" are `{}`, the literal that the code returns at `api/src/database/dynamodb-client-config.ts:18`. The agreed seam says "checks the endpoint", so the seam is correct. Only the Then is partly checked. `toEqual({})` checks the whole Then.

## Checked, no finding

- The function: `local` gives the endpoint, region and credentials. Every other value gives `{}`, and the function never throws. The `local` test checks literal values with `toEqual`, through the agreed seam, and doesn't mock the SDK.
- The Repository builds its client from the function. The only other change to the Repository is the `DATABASE` read. No refusal is in the Repository, and no `.tf` file changes.
- The dev server refuses a missing or unknown `DATABASE` with the exact message, like the `PORT` check. `nodemon` watches `.env`.
- With `local`, the dev server skips the startup login check, and the error handler never prints `NOT_LOGGED_IN_MESSAGE`. With `dev`, both work as before.
- `pnpm invoke` doesn't refuse a missing or unknown `DATABASE`.
- `api/.env.example` sets `DATABASE=local`, with a comment. The local table keeps the name `tdl-dev-todos`.
- The docs: the Settings table has `DATABASE`. The AWS sign-in step is for `DATABASE=dev` only (the step is now step 6). The dev-server section no longer says that the todos routes always use AWS. The structure doc names the new source file and the new test file.
- Scope: the diff adds nothing that the ticket didn't ask for.
- The scenarios that aren't ticked are manual checks for the closing check. The closing check isn't in this diff.
