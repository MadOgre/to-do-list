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
4. **Copy `api/.env.example` to `api/.env`.** Git ignores `api/.env`. Its comments say what each value is for.
5. **Sign in to AWS** with `aws login`. The API's code calls AWS with your credentials. Until the API has a resource, nothing calls AWS, and the dev server only warns when you're not signed in.

## Running it

From the repo root:

```sh
pnpm dev
```

This starts both packages' dev servers side by side, and prefixes each line with the package's folder:

- **The frontend** on <http://localhost:9000> (`frontend dev:` lines). Vite serves the app with HMR, and shows TypeScript and ESLint errors in the terminal and in the browser overlay.
- **The API** on <http://localhost:3000> (`api dev:` lines). See [The API's dev server](#the-apis-dev-server).

Both listen on localhost only, so they aren't reachable from your network. This matters most for the API's dev server, which runs with your AWS credentials. Both ports are fixed: if one is taken, its server stops with an error rather than moving to another port.

Ctrl+C stops both. pnpm may then print `Failed` for a package, which only means it was stopped.

### The proxy

The frontend calls the API at `/api` on its own origin (`VITE_API_BASE_URL=/api` in `frontend/.env`). Vite's dev server passes every request whose path starts with `/api` on to the API's dev server, with the path unchanged, because the API's routes start with `/api` too. So <http://localhost:9000/api/anything> reaches the API, and answers with the API's 404. The proxy is set in `frontend/vite.config.ts`, and it names port 3000: if you change `PORT` in `api/.env`, change the proxy too.

## The API's dev server

`api/dev/server.ts` plays API Gateway's part: it matches each request against `api/routes.json`, builds the event API Gateway would send, calls the function's own router (`api/src/index.ts`), and turns the result into an HTTP response. With no routes yet, it answers every request as API Gateway does, with a 404 and `{"message":"Not Found"}`.

Only the code is local. Once a resource uses AWS, the code reads and writes the real resources in AWS, with your own credentials. If you're not signed in, the server says so when it starts and when a request fails for that reason.

Send requests from another terminal:

```sh
curl -sS http://localhost:3000/api/anything
```

Saving a `.ts` or `.json` file in `api/src/` or `api/dev/`, or saving `api/routes.json` or `api/.env`, restarts the server. `tsc` checks the code before each start. When a change breaks the type check or the server, the terminal shows the error and the server waits. Fixing the file starts it again.

The function's log lines print in the terminal, indented (`POWERTOOLS_DEV=true` in `api/.env`), with the same keys as in CloudWatch. Each response's `apigw-requestid` header is the `correlation_id` of its lines, as in AWS (see [logging.md](logging.md)).

`pnpm invoke` (from `api/`) runs the built function, `api/dist/index.mjs`, with a sample event: `pnpm invoke sample-events/<resource>/<name>.json`. It reads `api/.env` too. Build first with `pnpm build`.

## Settings

Node loads `api/.env` with `--env-file`. A variable already set in your shell wins over the file. On macOS, Linux and WSL, `PORT=3001 pnpm dev` overrides it for one run, and a terminal where you once ran `export PORT=…` keeps that value until you close it or `unset PORT`.

| Variable | What it's for |
| --- | --- |
| `PORT` | The API dev server's port on `localhost`. |
| `POWERTOOLS_DEV` | `true` prints each log line as indented JSON. |

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
