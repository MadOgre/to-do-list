# Code audit

An audit of the whole repo on 2026-11-21, on the `todos-api` branch, after commit `2985543`. The audit checked every tracked file (131 files) and the ignored local files, except `node_modules/`. It looked for files that are extraneous or redundant, and for inconsistencies between the docs and the code.

**Result:** the repo is tidy. Almost every file has a clear job, and `docs/structure.md` matches the tree. The lists below show each finding and its state.

## Inconsistencies

| # | Finding | State |
| --- | --- | --- |
| 1 | `todos-repository.ts` reads `TODOS_TABLE`, but the variable isn't in `api/.env.example`, in the settings table of `docs/local-development.md`, or in the Lambda's `environment` in `infra/modules/app/main.tf`. `local-development.md` says to add every new variable to `.env.example`. | Open |
| 2 | The message of commit `2985543` says "the table", but `infra/` has no DynamoDB table (`modules/app/dynamodb.tf` doesn't exist). Only the `Table` object in the code exists. | Open |
| 3 | `api/CLAUDE.md` doesn't mention `src/todos/`. Its status line ("the API has no resources yet") is still true for the routes. | Open |
| 4 | `docs/local-development.md` says "Until the API has a resource, nothing calls AWS". This stays true only until a handler imports the repository. | Open |
| 5 | Every ticket said `Status: ready-for-agent`, but both features are built. | **Fixed.** See [Ticket statuses](#ticket-statuses). |
| 6 | The ADRs started at 0002, because ADR 0001 (the Dev VM) was deleted in `57a0cd7`. | **Fixed.** See [ADR renumbering](#adr-renumbering). |
| 7 | `infra/account/main.tf` sets no `default_tags`, but `bootstrap/` and `envs/dev/` tag every resource `project = to-do-list`. | **Fine.** The developer decided that the account's settings belong to the AWS account, not to this project. |
| 8 | `frontend/package.json` had `"version": "0.0.0"`, left over from the Vite template. `api/package.json` has no version. | **Fixed.** The field is removed. |
| 9 | `todos-repository.ts` wrote `async(id` without a space. Every other function writes `async (`. | **Fixed.** No other `async(` exists in the repo. A lint rule to catch it is still open: see [Open questions](#open-questions). |
| 10 | `docs/structure.md` said the repository "completes" Todos, but `setCompleted` can also mark a Todo Active again. | **Fixed.** The entry now says "marks one Completed or Active". |

## Files that may not need to be here

| # | Finding | State |
| --- | --- | --- |
| 1 | Nothing calls `useTodo` (`frontend/src/apiHooks/todos.ts`) or `getTodo` (`frontend/src/api/todos.ts`). They are the only dead code in the frontend. Delete them, or keep them for the real API. | Open |
| 2 | Nothing uses the `caller_arn` and `account_id` outputs or their `aws_caller_identity` data source in `infra/account/main.tf`. They look left over from the first setup check. | Open |
| 3 | Nothing imports `api/src/todos/todo-id.ts` yet. `structure.md` says that `todos-repository.ts` isn't used yet, but says nothing like that for `todo-id.ts`. This is probably work in progress on `todos-api`. | Open |
| 4 | Three files describe the frontend: `frontend/GUIDE.md`, `frontend/CLAUDE.md` and the `frontend/` part of `docs/structure.md`. The "Project layout" block in `GUIDE.md` repeats `structure.md` the most, and the GUIDE's scripts table repeats the README's. They can drift apart. | Open |
| 5 | `eslint` is a dev dependency at the root, in `frontend` and in `api`. `typescript` is `6.0.3` at the root and `~6.0.2` in `frontend`, and `api` doesn't list it. A change needs the developer's go-ahead. | Open |

## Decisions and changes

### Ticket statuses

- The repo's five triage labels had no word for a finished ticket. The developer chose `done`.
- `docs/agents/triage-labels.md` now defines `done`: every box is checked, and the developer's manual check is recorded in the ticket's comments. The "Default vocabulary" line in the root `CLAUDE.md` lists it too.
- Seven tickets are `done`, each with a dated closing note in its comments: `mantine-install` 01 and 02, and `todo-list-mvp` 01, 02, 03, 05 and 06.
- `todo-list-mvp` ticket 04 (deleting a Todo) stays `ready-for-agent`, as the developer chose. Its manual-check box is unchecked, and no note says the developer did the check.

### ADR renumbering

- `docs/adr/0002-mantine-components-with-scss-modules.md` is now `docs/adr/0001-mantine-components-with-scss-modules.md` (with `git mv`).
- Every `ADR-0002` pointer now says `ADR-0001`, in 12 files: `CLAUDE.md`, `frontend/GUIDE.md`, `docs/structure.md`, and the specs, tickets and round 3 of both planning folders.
- One line stays as it is: `docs/planning/mantine-install/round_2_questions.md:75`. It is the original grilling question, and it proposes `0002-mantine-component-library.md`, a filename that never existed.

## Open questions

- **A lint rule for the space after `async`.** Add `"@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }]` to `eslint.config.base.js`? `@stylistic/eslint-plugin` is already installed.
- **Round 2's ADR filename.** Change the proposed filename in `round_2_questions.md:75`, or keep the record as it was asked?
- **The commit.** No change from this audit is committed. The changes have nothing to do with `todos-api`. Commit them on a separate branch, or on `todos-api`? Before the commit, run `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start.

## Outside the repo

At the start of the session, the Claude Code footer showed "gh auth login for PR status", although `gh` was logged in as `MadOgre`. The cause was the old `gh` from Ubuntu's repository (2.4.0, from 2022), which has no `gh auth token` command. The developer installed `gh` 2.105.0 from GitHub's apt repository (`https://cli.github.com/packages`). The login and the `repo` scope stayed the same. The footer shows no PR status until `todos-api` has a pull request.
