# Local Development

How to run the app on your machine, and what that does and doesn't imitate.

## Supported systems

macOS, Linux, Windows with WSL 1 or WSL 2, and Windows itself. The same commands work on all of them.

**One OS per checkout.** `node_modules` holds binaries built for one OS. If you run `pnpm install` in the same folder from Windows and from WSL (or any second OS), each install replaces the other's. Pick one OS for each checkout.

## First-time setup

1. **Node 26.** The version is pinned in `.nvmrc` and in `engines` in the root `package.json`. Use a version manager that reads `.nvmrc`, such as [fnm](https://github.com/Schniz/fnm) (every OS), [nvm](https://github.com/nvm-sh/nvm) (macOS, Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows). Check with `node --version`: it should print a `v26`.
2. **pnpm, at the pinned version.** `packageManager` in the root `package.json` pins pnpm. Corepack, which ships with Node, runs exactly that version, but only once it's enabled. A globally installed pnpm ignores the pin and installs with its own version.
   - **Windows:** if pnpm is installed globally, remove it with `npm rm -g pnpm`. Then run `corepack enable` in a cmd opened as administrator, because Node's install folder needs admin rights.
   - **macOS and Linux:** run `corepack enable`, with `sudo` if Node is installed system-wide.
   - **Check:** `pnpm --version` in the repo prints the pinned version.
3. **Install the packages,** from the repo root: `pnpm install`. If it fails with `EACCES` errors on WSL, close VS Code and run it again: VS Code's file watching can block the install.
4. **Install Java and DynamoDB Local.** `pnpm dev` starts DynamoDB Local, a local copy of DynamoDB that runs on Java. DynamoDB Local goes in `api/.dynamodb-local/`, which git ignores, and keeps its tables in the `data/` folder there. When DynamoDB Local runs, it writes `api/dynamodb-local-metadata.json`, which git also ignores.
   - **WSL and Linux:** run `bin/setup-local-db.sh` from the repo root. If `java` isn't found, the script installs Java with `sudo apt`, so it asks for your password. If DynamoDB Local isn't there, the script downloads and unpacks it. A second run changes nothing.
   - **Every other system:** install Java 17 or newer. Then, from the repo root, download and unpack DynamoDB Local:

     ```sh
     mkdir -p api/.dynamodb-local/data
     curl -fLo api/.dynamodb-local/dynamodb_local_latest.tar.gz https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz
     tar -xzf api/.dynamodb-local/dynamodb_local_latest.tar.gz -C api/.dynamodb-local
     ```

     On Windows itself, run the commands in PowerShell, with `curl.exe` in place of `curl` and `mkdir` without `-p`.
   - **Check:** `java -version` prints a version, and `api/.dynamodb-local/DynamoDBLocal.jar` exists.
5. **Copy `api/.env.example` to `api/.env`.** Git ignores `api/.env`. Its comments say what each value is for. `DATABASE=local` selects DynamoDB Local, so you need no AWS account (see [Settings](#settings)).
6. **Fill the local todos table** once: from the repo root, run `pnpm db:reset`. The reset prints `Reset tdl-dev-todos: 6 Todos written.` Before the first reset, the table doesn't exist, and every todos route answers 500. See [Reset Local Database](#reset-local-database).
7. **Only for `DATABASE=dev`: sign in to AWS** with `aws login`. With `dev`, the API's code calls AWS with your credentials: every todos route reads or writes the real todos table in DynamoDB. If you're not signed in, the dev server warns at startup, and those routes fail. With `DATABASE=local`, skip this step.

## Running it

From the repo root:

```sh
pnpm dev
```

This starts three servers side by side, and prefixes each line with the package's folder:

- **The frontend** on <http://localhost:9000> (`frontend dev:` lines). Vite serves the app with HMR, and shows TypeScript and ESLint errors in the terminal and in the browser overlay.
- **The API** on <http://localhost:3000> (`api dev:` lines). See [The API's dev server](#the-apis-dev-server).
- **DynamoDB Local** on <http://localhost:8000> (`api dev:` lines too), with its telemetry off. It keeps its tables in `api/.dynamodb-local/data/`, so they survive a stop and a start. If DynamoDB Local fails to start, the terminal shows its error, and the frontend and the API keep running. If it isn't installed, the error is Java's `Unable to access jarfile`: see step 4 of [First-time setup](#first-time-setup).

The frontend and the API listen on localhost only, so they aren't reachable from your network. This matters most for the API's dev server, which runs with your AWS credentials. DynamoDB Local has no option to listen on localhost only, so other machines on your network can reach DynamoDB Local on port 8000. All three ports are fixed: if one is taken, its server stops with an error rather than moving to another port. On WSL 1, DynamoDB Local is the exception: it can start on a taken port 8000 and print no error.

Ctrl+C stops all three. pnpm may then print `Failed` for a package, which only means it was stopped.

### The proxy

The frontend calls the API at `/api` on its own origin (`VITE_API_BASE_URL=/api` in `frontend/.env`). Vite's dev server passes every request whose path starts with `/api` on to the API's dev server, with the path unchanged, because the API's routes start with `/api` too. So <http://localhost:9000/api/anything> reaches the API, and answers with the API's 404. The proxy is set in `frontend/vite.config.ts`, and it names port 3000: if you change `PORT` in `api/.env`, change the proxy too.

## The API's dev server

`api/dev/server.ts` plays API Gateway's part: it matches each request against `api/routes.json`, builds the event API Gateway would send, calls the function's own router (`api/src/router/router.ts`), and turns the result into an HTTP response. A request that matches no route gets API Gateway's own answer: a 404 and `{"message":"Not Found"}`.

`DATABASE` in `api/.env` selects the database that the todos routes read and write. With `local`, they use DynamoDB Local, with fake credentials, and the server never checks your AWS login. With `dev`, they use the real table in AWS, with your own credentials: if you're not signed in, the server says so when it starts and when a request fails for that reason. With no `DATABASE`, or any other value, the server stops at startup with `DATABASE must be local or dev (see api/.env.example)`, and waits until you save `api/.env` with a valid value.

Send requests from another terminal:

```sh
curl -sS http://localhost:3000/api/anything
```

Saving a `.ts` or `.json` file in `api/src/` or `api/dev/` (except the sample events), or saving `api/routes.json` or `api/.env`, restarts the server. `tsc` checks the code before each start. When a change breaks the type check or the server, the terminal shows the error and the server waits. Fixing the file starts it again.

The function's log lines print in the terminal, indented (`POWERTOOLS_DEV=true` in `api/.env`), with the same keys as in CloudWatch. Each response's `apigw-requestid` header is the `correlation_id` of its lines, as in AWS (see [logging.md](logging.md)).

`pnpm invoke` (from `api/`) runs the built function, `api/dist/index.mjs`, with a sample event: `pnpm invoke dev/sample-events/<resource>/<name>.json`. It reads `api/.env` too. Build first with `pnpm build`.

## Reset Local Database

`pnpm db:reset`, from the repo root, deletes the local todos table, creates it again, and writes the six Demo Todos from `api/dev/seeds/todos.ts`. Each reset puts back the same six Todos, with the same IDs.

The reset works whether `pnpm dev` runs or not. If DynamoDB Local runs already, the reset uses it and leaves it running. If DynamoDB Local isn't running, the reset starts it, prints `DynamoDB Local isn't running. Starting it…`, resets the table, and stops DynamoDB Local again with `Stopped DynamoDB Local.` If DynamoDB Local doesn't answer within 10 seconds, for example because it isn't installed, the reset stops with an error and exits with code 1. The reset checks only that a program answers on port 8000. If a foreign program uses the port, the reset fails: free the port.

The reset always uses DynamoDB Local on `localhost:8000`, with fake credentials, whatever `DATABASE` says. So the reset never changes a table in AWS. It reads the table's name from `TODOS_TABLE` in `api/.env`.

## Settings

Node loads `api/.env` with `--env-file`. A variable already set in your shell wins over the file. On macOS, Linux and WSL, `PORT=3001 pnpm dev` overrides it for one run, and a terminal where you once ran `export PORT=…` keeps that value until you close it or `unset PORT`.

| Variable | What it's for |
| --- | --- |
| `PORT` | The API dev server's port on `localhost`. |
| `POWERTOOLS_DEV` | `true` prints each log line as indented JSON. |
| `DATABASE` | The database that the todos routes use: `local` for DynamoDB Local on port 8000, or `dev` for the real dev table in AWS, after `aws login`. The dev server refuses any other value, and a missing one. The deployed Lambda doesn't get `DATABASE`, and uses the real DynamoDB. |
| `TODOS_TABLE` | The todos table's name. Locally, the code uses the dev environment's table name, `tdl-dev-todos`, for DynamoDB Local and for AWS alike. |

When code starts reading a new variable, add it to `api/.env.example`, with a comment, and a placeholder such as `XXXXXXX` for values that differ per person.

The frontend's settings are in `frontend/.env` (committed, with safe defaults). Override them in `frontend/.env.local`, which git ignores.

## What it doesn't imitate

- **Permissions.** The API's code runs with your credentials, not the function's role. A permission missing from the role works locally and fails in AWS (`AccessDenied`, 500).
- **The bundle and the runtime.** Lambda runs `api/dist/index.mjs` on Node 26; the dev server runs `api/src/` on your local Node.
- **Logs and limits.** No access log, no request limit (the stage's 10 per second, burst 20), no 10-second timeout, no 512 MB limit, no cold starts.
- **Some request details.** Request IDs are UUIDs, `requestContext.time` is in ISO format, cookies stay in `headers` (no `cookies` field), bodies over 6 MB get a 500, and only `text/*` bodies arrive unencoded (everything else is base64). Path variables must be plain `{name}`: a greedy `{name+}` isn't translated for Express.

Try every change against the deployed dev environment too (`pnpm deploy:dev`) before relying on it.

## On WSL 1

A second server on a port that's already in use doesn't fail on WSL 1: both seem to listen. Stop the old one before starting another.
