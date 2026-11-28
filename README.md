# to-do-list

A to-do list web app: a React + TypeScript frontend on Vite, with Mantine, React Router, React Query, axios and SCSS, and a TypeScript API on AWS Lambda behind an HTTP API, deployed with Terraform.

## Prerequisites

- **Node 26.** It's pinned in `.nvmrc`, so [fnm](https://github.com/Schniz/fnm) or nvm picks it up.
- **pnpm through corepack.** Run `corepack enable` once. On Windows, remove any global pnpm first (`npm rm -g pnpm`), then run `corepack enable` in an admin prompt.
- **Java 17 or newer,** for DynamoDB Local, which `pnpm dev` starts. On WSL and Linux, `bin/setup-local-db.sh` installs Java and DynamoDB Local.
- **For the API's AWS parts:** the AWS CLI and Terraform 1.16.

## Quick start

```sh
git clone <repo-url> to-do-list
cd to-do-list
pnpm install
bin/setup-local-db.sh          # WSL and Linux; other systems: see docs/local-development.md
cp .env.example .env   # in Windows cmd: copy .env.example .env
pnpm db:reset                  # once
pnpm dev
```

The frontend opens at **<http://localhost:9000>**, and the API runs at **<http://localhost:3000>**. Full details, on every OS: [docs/local-development.md](docs/local-development.md).

## Scripts

Run them from the repo root.

| Command | Does |
| --- | --- |
| `pnpm dev` | Starts the frontend's and the API's dev servers side by side |
| `pnpm db:reset` | Resets the local todos table in DynamoDB Local to the six Demo Todos. Never touches AWS |
| `pnpm build` | Type-checks and builds both packages, into `frontend/dist/` and `api/dist/` |
| `pnpm typecheck` | Type-checks the API and the shared package, `common/` |
| `pnpm lint` | Runs ESLint on the root's own files, then in each package |
| `pnpm test` | Runs the unit tests (Vitest) of the API and the frontend, with no AWS and no browser |
| `pnpm test:verbose` | Runs the same tests, and lists every test by name, with no output cut short |
| `pnpm deploy:dev` | Builds the API, then deploys the dev environment with `terraform apply` |

Each package has its own scripts too, such as `pnpm preview` in `frontend/` and `pnpm invoke` in `api/`.

## Caveats

- **Ports 9000 and 3000 are fixed.** If one is taken, its server stops with an error rather than moving to another port.
- **One OS per checkout.** `node_modules` holds binaries for a single OS, so don't install from both Windows and WSL in the same folder.

## More

- [docs/local-development.md](docs/local-development.md): setup on every OS, running both servers, and what local runs don't imitate
- [docs/structure.md](docs/structure.md): what every folder and file is for
- [docs/adding-and-removing-resources.md](docs/adding-and-removing-resources.md): every place an API resource touches, with code templates
- [docs/logging.md](docs/logging.md): the API's logs, and how to follow one request through them
- [frontend/GUIDE.md](frontend/GUIDE.md): the frontend's conventions, and where the project came from
- [GLOSSARY.md](GLOSSARY.md): the project's terms
