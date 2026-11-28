# Local work uses DynamoDB Local, not Docker and not the AWS dev table

Until now, `pnpm dev` ran the API against the real `tdl-dev-todos` table in AWS, so every developer needed `aws login`. Local work now uses DynamoDB Local, the Java program from AWS, on port 8000. A developer then needs no AWS account and no AWS CLI. `DATABASE=dev` in `api/.env` still selects the real dev table.

## Considered Options

- **The AWS dev table for all local work** (rejected). Every developer needs an AWS account and `aws login`, and local tests change shared data.
- **DynamoDB Local in Docker** (rejected). Docker is a larger install than Java, and the project uses no Docker anywhere else.

## Consequences

- Each machine needs Java and a DynamoDB Local download in `api/.dynamodb-local/`. `bin/setup-local-db.sh` installs both on WSL and Linux, and `docs/local-development.md` gives the manual steps for other systems.
- `pnpm dev` always starts DynamoDB Local, with `-sharedDb`, so the API and the reset see the same tables.
- A fresh DynamoDB Local has no tables. `pnpm db:reset` creates the todos table and writes the Demo Todos from `api/dev/seeds/todos.ts`.
- The deployed Lambda never gets `DATABASE`, and uses the real DynamoDB. Only the dev server refuses to start without `DATABASE`.
