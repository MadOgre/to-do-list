# Code audit (2026-11-24)

## Summary

The audit of the whole repo was performed on 2026-11-23 and 2026-11-24, on the `todos-api` branch. It found 46 issues. 33 are fixed, and 13 are closed after discussion, with no change. None remain unfixed.

What was decided, in brief:

- **Docs:** brought up to date with the todos resource, with one place for each name and file.
- **Names:** each Todo operation has one name through every layer. `GLOSSARY.md` (formerly `CONTEXT.md`) defines the API's terms, the operations, Owner and User.
- **Conventions:** file names in kebab-case, as a guideline with exceptions. An `interface` for each object shape. Shared dependency versions come from the pnpm catalog, and TypeScript is locked to 6.0.3.
- **Code:** one zod schema checks `routes.json`. The API's dev tools and sample events are in `api/dev/`. The Sass helpers come in through the `@/` alias. The NotFound Page shares the Home Page's layout.
- **Kept on purpose:** one line per route handler in the registry, a refresh in each API Hook, three plain confirm dialogs, and DynamoDB's projection in List Todos.
- **Left for later units:** tests come next. Hosting, logins, and the end of the Demo Todos come later. No license, because the repo is private.

The commits: `eed10b0`, `01707ab`, `2c5409f`, `fc26bdb`, `73823ab`, `915436a`, `0369682`, `b4f1324`, `344532f`.

The sections below are the audit's working record, as it was written.

## The audit

An audit of the whole repo on 2026-11-23, on the `todos-api` branch, after commit `ea9dffd`. It replaces the audit of 2026-11-21 (commit `2985543`), and its last section gives the state of each finding from that audit.

The audit read every tracked file (156 files) and the ignored local files, except `node_modules/`, `dist/` and `.terraform/`. It checked three things:

- **Stray files:** files and code that have no job, or that repeat another file.
- **Consistency:** docs that disagree with the code, and names and folders that don't follow one pattern.
- **Questions:** what a senior developer would ask on a first read of the codebase.

`pnpm lint` and `pnpm typecheck` pass. The audit didn't run `pnpm build` or `pnpm dev`, and it changed no file except this one.

**Result:** the code is tidy and well commented, and `docs/structure.md` lists every file, directly or through a pattern. Most findings come from one change: the API now has its first resource, but some docs still describe an API with no resources. The other findings are names that differ between the API and the frontend.

## 1. Files and code that may not need to be here

| # | Finding | State |
| --- | --- | --- |
| 1.1 | `todoSchema` (`common/src/todos.ts`) is exported, but nothing imports it. The API and the frontend use only its type, `Todo`. | **Closed** on 2026-11-24: every type in `common/` comes from an exported schema, and `todoSchema` follows that rule. Without the export, lint fails: `@typescript-eslint/no-unused-vars` reports a value that is only used as a type. |
| 1.2 | `api/src/router/routes.ts` exports the `Route` type, but only `routes.ts` uses it. | **Fixed** on 2026-11-23, as A10. |
| 1.3 | `frontend/src/interfaces/Todo.ts` gives the two request bodies a second name: `CreateTodoInput` is `CreateTodoBody`, and `UpdateTodoInput` is `SetTodoCompletedBody`. The aliases add no type. They only add a name. See 3.2. | **Fixed** on 2026-11-24, as B13. |
| 1.4 | Nothing uses the `caller_arn` and `account_id` outputs or their `aws_caller_identity` data source in `infra/account/main.tf`. They look left over from the first setup check. | **Fixed** on 2026-11-23, as B5. |
| 1.5 | Three files describe the frontend: `frontend/GUIDE.md`, `frontend/CLAUDE.md` and the `frontend/` part of `docs/structure.md`. The "Project layout" block in `GUIDE.md` repeats `structure.md`, and the GUIDE's scripts table repeats the README's. They can drift apart. | **Fixed** on 2026-11-24, as B22. |
| 1.6 | `eslint` is a dev dependency at the root, in `frontend`, in `api` and in `common`. `typescript` is `6.0.3` at the root and `~6.0.2` in `frontend`, and `api` and `common` don't list it. A change needs the developer's go-ahead. | **Fixed** on 2026-11-24, as B24. |
| 1.7 | `docs/agents/issue-tracker.md` has a "Wayfinding operations" section for `/wayfinder`. No `map.md` exists, and its status values (`claimed`, `resolved`) aren't in `triage-labels.md`. | **Fixed** on 2026-11-24, as B6: the section stays, because `/wayfinder` needs it. |
| 1.8 | The four design screenshots in `docs/planning/todo-list-mvp/design/` are 12 MB together, which is most of the repo's size. They stay in the git history even if they're deleted. | **Closed** on 2026-11-24, as B23. |
| 1.9 | `api/scripts/` holds one file, `invoke.ts`. The other local-only tools are in `api/dev/`, and `invoke.ts` already imports `dev/local-context.ts`. | **Fixed** on 2026-11-23, as B9. |

## 2. Docs that disagree with the code

| # | Finding | State |
| --- | --- | --- |
| 2.1 | `GLOSSARY.md:40` says the Demo Todos "exist only until the app has a real API". The app has a real API now, and the Demo Todos still exist, through `POST /api/demo-todos/restore`. The definition also says that the list shows them "until the user's own list is saved". That was the localStorage behavior. | **Fixed** on 2026-11-24, as C5. |
| 2.2 | `docs/local-development.md:20` says "Until the API has a resource, nothing calls AWS". Every todos route calls DynamoDB now. | **Fixed** on 2026-11-23, as A3. |
| 2.3 | `docs/local-development.md:45` says "With no routes yet, it answers every request … with a 404". `routes.json` has six routes. | **Fixed** on 2026-11-23, as A2. |
| 2.4 | The settings table in `docs/local-development.md` (lines 65 to 68) lists `PORT` and `POWERTOOLS_DEV`, but not `TODOS_TABLE`. `api/.env.example` has all three. | **Fixed** on 2026-11-23, as A4. |
| 2.5 | `docs/adding-and-removing-resources.md` is written for the first resource. Line 11, step 1 ("for the first resource only"), line 138 ("Replace the file's `export {};`") and line 150 ("Create the file for the first resource") don't apply now: `@aws-sdk/lib-dynamodb`, `dynamodb-toolbox`, `dynamodb.tf` and the exports in `handler-registry.ts` already exist. | **Fixed** on 2026-11-23, as A7. |
| 2.6 | The template in `adding-and-removing-resources.md` gives a table one partition key, `id`. The real todos table has a partition key `owner_id`, a sort key `todo_id`, and `DEMO_OWNER_ID` in the repository. A second resource has no guide for which shape to copy. | **Closed** on 2026-11-24, as C4. |
| 2.7 | `infra/CLAUDE.md:24` says that `dynamodb.tf` is created by "the first resource". The file exists. The "Where to find" table has no row for the todos table (`dynamodb.tf`) or its policy (`aws_iam_role_policy.api_todos_table`). | **Fixed** on 2026-11-23, as A5. |
| 2.8 | `docs/structure.md:353` says that the root `CLAUDE.md` points to the `CLAUDE.md` files "in frontend/, api/ and infra/". It also points to `common/CLAUDE.md`. | **Fixed** on 2026-11-23, as A1. |
| 2.9 | `docs/structure.md:360` describes `CODE_AUDIT.md` as "the audit of 2026-11-21". This file is now the audit of 2026-11-23. | **Closed.** `CODE_AUDIT.md` is a temporary file, so `structure.md` needn't keep it current. See B1 for the entry that is there now. |
| 2.10 | `docs/logging.md` (lines 57 and 82) gives `GET /api/articles/{article_id}` as an example route key. That route doesn't exist. A real route, such as `PATCH /api/todos/{todo_id}`, would let a reader try the example. | **Fixed** on 2026-11-23, as A6. |
| 2.11 | Both `spec.md` files say `Status: ready-for-agent`, but both features are built. The specs also write `Status:` as plain text, and the tickets write `**Status:**` in bold. | **Fixed** on 2026-11-23, as B7. |
| 2.12 | `todo-list-mvp` ticket 04 is still `ready-for-agent`, as the developer chose in the last audit: its manual check isn't recorded. | **Fixed** on 2026-11-23, as B8. |
| 2.13 | The `todos-api` work (the `common` package, six routes, the DynamoDB table and the frontend's switch to the API) has no folder in `docs/planning/`. The root `CLAUDE.md` says that every feature starts from an `INTENT.md`. | **Closed** on 2026-11-24, as C6. |

## 3. Names and structure

### 3.1 File names follow a different pattern in each package (**Fixed** on 2026-11-24, as C2)

| Package | Files | Folders |
| --- | --- | --- |
| `api/`, `common/` | kebab-case: `todos-repository.ts`, `error-body.ts` | kebab-case: `route-handler-tools/`, `route-handlers/` |
| `frontend/` modules | camelCase: `apiClient.ts`, `errorText.ts`, `queryClient.ts` | camelCase: `apiHooks/` |
| `frontend/` components and types | PascalCase: `TodoRow.tsx`, `TodoFilter.ts` | PascalCase: `TodoRow/`, `Home/` |

Each pattern is common in its own world: kebab-case in Node, and PascalCase components in React. But no doc states the rule, and lint doesn't check it. See question 5.5.

### 3.2 One operation has up to four names

| Route | API route handler | Repository function | API Function | API Hook |
| --- | --- | --- | --- | --- |
| `GET /api/todos` | `listTodos` | `listTodos` | `getTodos` | `useTodos` |
| `POST /api/todos` | `createTodo` | `createTodo` | `createTodo` | `useCreateTodo` |
| `PATCH /api/todos/{todo_id}` | `setTodoCompleted` | `setTodoCompleted` | `updateTodo` | `useUpdateTodo` |
| `DELETE /api/todos/{todo_id}` | `deleteTodo` | `deleteTodo` | `deleteTodo` | `useDeleteTodo` |
| `DELETE /api/todos?completed=true` | `clearCompletedTodos` | `clearCompletedTodos` | `clearCompletedTodos` | `useClearCompletedTodos` |
| `POST /api/demo-todos/restore` | `restoreDemoTodos` | `replaceTodos` | `restoreTodos` | `useRestoreTodos` |

The request bodies have two names too: `CreateTodoBody` and `CreateTodoInput`, `SetTodoCompletedBody` and `UpdateTodoInput`. The frontend says "update" for a request that can only set `completed`. The API's name says exactly what the request does. See question 5.4.

### 3.3 Other names

| # | Finding | State |
| --- | --- | --- |
| 3.3.1 | The route handlers and the repository use the same function names (`createTodo`, `listTodos` and so on). The route handlers import the repository as `* as todosRepository` to keep them apart. A search for `createTodo` finds three functions: the route handler, the repository function and the API Function. | **Closed** on 2026-11-24, as C3: the route handler and its repository function share one name on purpose. |
| 3.3.2 | The frontend's API Functions and the update mutation call the Todo's ID `id` (`updateTodo(id, input)`, `deleteTodo(id)`, `{ id, input }`). The Todo's field is `todo_id`, after commit `1ad702e`. | **Fixed** on 2026-11-23, as A11. |
| 3.3.3 | `frontend/src/theme.ts` imports its SCSS module as `classes`. Every other file imports its module as `styles`. | **Fixed** on 2026-11-23, as A9: every file now uses `classes`, the name in Mantine's docs. |
| 3.3.4 | The folder `frontend/src/interfaces/` holds only `type` aliases, and no `interface`. The props in the components are `interface`s, and the API uses `type` everywhere. No doc says when to use which. | **Fixed** on 2026-11-24, as C2: the folder is now `types/`. |
| 3.3.5 | Commit `2353451` says "name every AWS resource with the tdl prefix". Some names don't use the prefix: the state bucket `to-do-list-tfstate-d9a7bc3a`, the budget `monthly-cost` and the inline policy `todos-table-access`. Powertools' service is `to-do-list-api`, and the local stand-in function is `to-do-list-api-local`, while the real function is `tdl-dev-api`. The bucket can't be renamed without a new bucket. | **Closed** on 2026-11-24, as B26. |
| 3.3.6 | `GLOSSARY.md` says to avoid the word "common" for a Shared Component, but the shared package is named `common`. The two meanings differ, so this is a small clash, not an error. | **Closed** on 2026-11-23, as B2. |
| 3.3.7 | `GLOSSARY.md` defines the frontend's terms (Page, API Function, API Hook), but not the API's. The API docs use resource, route handler, repository, outcome, owner and version as fixed terms. | **Fixed** on 2026-11-24, as C1. |
| 3.3.8 | `tsconfig.base.json` writes its comments as `//`. `frontend/tsconfig.app.json` and `tsconfig.node.json` use `/* … */`, left over from the Vite template. | **Fixed** on 2026-11-23, as A8. |
| 3.3.9 | `api/src/router/routes.ts` lists the HTTP methods twice: in the `HttpMethod` type and in the `HTTP_METHODS` array. `api/dev/server.ts` lists them a third time, in `EXPRESS_METHODS`. TypeScript checks the first and the third against `HttpMethod`, but not that `HTTP_METHODS` is complete. | **Fixed** on 2026-11-24, as B14: `routes.ts` writes the methods once. `EXPRESS_METHODS` in `dev/server.ts` is a `Record<HttpMethod, …>`, so TypeScript checks that it covers every method. |
| 3.3.10 | `frontend/src/pages/NotFound/NotFound.tsx` uses plain `<main>`, `<h1>` and `<Link>`, with no Mantine components and no styles. ADR-0001 says that UI components come from Mantine. | **Fixed** (B20, `344532f`): a shared `PageLayout` gives it Home's background, header and theme toggle, with a Mantine card. |

### 3.4 Folders

| # | Finding | State |
| --- | --- | --- |
| 3.4.1 | `frontend/src/` has six loose files: `main.tsx`, `routes.tsx`, `queryClient.ts`, `theme.ts`, `theme.module.scss` and `vite-env.d.ts`. `theme.module.scss` is a style file outside `styles/`. | **Fixed** on 2026-11-23, as B10. |
| 3.4.2 | The temporary Restore Demo Todos code is in five places: `api/src/resources/todos/demo-todos.ts`, `route-handlers/restore-demo-todos.ts`, `replaceTodos` in the repository, `restoreTodos` and `useRestoreTodos` in the frontend, and the link in `Home.tsx`. Each one has a "Temporary" comment, and `frontend/CLAUDE.md` lists them. No ticket says when they go away. | **Closed** on 2026-11-24, as C5: the temporary code goes away some time after logins come. |
| 3.4.3 | `api/dev/sample-events/todos/` has a sample event for each route, and two bad requests. It has none for `invalid_id`, `not_found` or `version_conflict`. | **Closed** on 2026-11-24, as B21. |

### 3.5 Code that could be simpler

The developer's goal: readable, maintainable code with no kludges. An abstraction that a reader can't understand at once gets a simpler replacement, if the replacement keeps the behavior. A second pass looked for these. Each finding below has an item in group B of section 6.

| # | Finding | The simpler form | State |
| --- | --- | --- | --- |
| 3.5.1 | `api/src/route-handler-tools/responses.ts` has a `buildResponse` helper with a `contentType` parameter. Only `json` calls it, always with `application/json`. | Write the response object in `json` itself, and remove `buildResponse` and `JSON_CONTENT_TYPE`. | **Fixed** on 2026-11-23, as B11. |
| 3.5.2 | `api/src/router/routes.ts` checks `routes.json` with a hand-written type guard (`isHttpMethod` with `.some`), a second list of the methods (`HTTP_METHODS`), a type annotation that works around TypeScript's `never[]`, and a `map` that copies each route. `zod` is already a dependency of `api/`, and `json-body.ts` uses it. | One zod schema: `z.array(z.object({ method: z.enum([...]), path: z.string(), handler: z.string() }))`, with `HttpMethod` and `Route` from `z.infer`. The methods are written once, and the guard, the annotation and the `map` go. | **Fixed** on 2026-11-24, as B14. |
| 3.5.3 | `api/src/router/handler-registry.ts` re-exports each route handler, and `router.ts` imports the file as a namespace (`import * as handlers`), then assigns the namespace to a `Record<string, RouteHandler>`. A reader must know that a module namespace is an object with one key per export. | `handler-registry.ts` exports one plain object: `export const routeHandlers: Record<string, RouteHandler> = { clearCompletedTodos, createTodo, … }`. The type also checks each handler where it's listed. | **Fixed** on 2026-11-24, as B15: a comment explains the namespace import, and the registry stays one line per route handler. |
| 3.5.4 | `todos-repository.ts` removes `owner_id` from an item in two ways: `listTodos` asks DynamoDB for a list of attributes, and `setTodoCompleted` copies four fields into a new object. | One `toTodo(item)` function that both use, so one place says what a Todo has. | **Fixed** (B16): the finding was a mistake. A Query can name its attributes, but an UpdateItem can't. Both ways stay, and a comment in `setTodoCompleted` says why. |
| 3.5.5 | `frontend/src/apiHooks/todos.ts` writes `useQueryClient()` and the same `onSettled` invalidation in each of the five mutation hooks. `queryClient.ts` already handles every mutation's error in one place. | Invalidate `["todos"]` in the `MutationCache`'s `onSettled` in `queryClient.ts`, next to its `onError`. Each hook is then `useMutation({ mutationFn })`. | **Closed** (B17): each hook keeps its own `onSettled`. Refreshing every query reaches into unrelated data, refreshing only `["todos"]` ties `query-client.ts` to one resource, and `meta` is too clever for five plain copies. |
| 3.5.6 | `Home.tsx` opens three confirm dialogs, each with the same `labels`, `confirmProps: { color: "red" }` and `Text size="sm"` body. | One small function, such as `confirmDanger({ title, text, confirmLabel, onConfirm })`, in the same file. | **Closed** (B18): the three plain calls stay. Each one shows the whole dialog, and a function would save only about 6 lines. |
| 3.5.7 | `frontend/vite.config.ts` builds the absolute path of `_mantine.scss` with `fileURLToPath` and a backslash replacement, for the injected `@use`. The SCSS modules already reach the `styles/` folder through the alias: `@use "@/styles/text-button"`. | `additionalData: '@use "@/styles/mantine" as mantine;'`, and remove `mantineSassHelpersPath`. The audit didn't test it: a build on Windows and on WSL must show that the alias works in `additionalData` too. | **Fixed** (B19, `b4f1324`): the alias works. The WSL build makes the same CSS as before. Not tested from Windows. |

## 4. Findings from the audit of 2026-11-21

| Old # | Finding | State now |
| --- | --- | --- |
| Inconsistency 1 | `TODOS_TABLE` was missing from `api/.env.example`, `local-development.md` and the Lambda's `environment`. | **Fixed.** `.env.example` and `main.tf` had it already, and A4 added it to `local-development.md`. |
| Inconsistency 2 | A commit message named a table that `infra/` didn't have. | **Fixed.** `infra/modules/app/dynamodb.tf` has the table (commit `2353451`). |
| Inconsistency 3 | `api/CLAUDE.md` didn't mention the todos code. | **Fixed.** Its status line and its map describe the todos resource. |
| Inconsistency 4 | `local-development.md`: "Until the API has a resource, nothing calls AWS". | **Fixed** on 2026-11-23, as A3. |
| Inconsistencies 5 to 10 | Ticket statuses, ADR numbers, `default_tags`, the package version, `async(`, the repository's entry in `structure.md`. | Fixed or decided in the last audit. No change. |
| Files 1 | `useTodo` and `getTodo` had no callers. | **Fixed.** Both are gone. |
| Files 2 | The unused `caller_arn` and `account_id` outputs. | **Fixed** on 2026-11-23, as B5. |
| Files 3 | Nothing imported `todo-id.ts`. | **Fixed.** `delete-todo.ts` and `set-todo-completed.ts` use it. |
| Files 4 | Three files describe the frontend. | **Open.** See 1.5. |
| Files 5 | The repeated `eslint` and `typescript` dependencies. | **Fixed** on 2026-11-24, as B24. |
| Open question | A lint rule for the space after `async`. | **Fixed** on 2026-11-23, as B4. |
| Open question | The proposed ADR filename in `round_2_questions.md:75`. | **Fixed** on 2026-11-23, as B3. |
| Open question | Where to commit the last audit. | **Done.** Commit `866f467` holds it. |

## 5. Questions a senior developer would ask

Each question names a decision for the developer. The answers below a question are the possible choices.

### Planning and terms

**5.1** The `todos-api` work has no `docs/planning/todos-api/` folder (finding 2.13). Should it get one?

- A. Yes: write an `INTENT.md` and a short spec after the fact, so the planning record covers every feature.
- B. Yes, but only an `INTENT.md` that records the goal and points to the commits.
- C. No: the commits and `adding-and-removing-resources.md` are enough. Write in the root `CLAUDE.md` that infrastructure work can skip the planning stages.

**5.2** Should `GLOSSARY.md` define the API's terms (finding 3.3.7)?

- A. Yes: add Resource, Route Handler, Repository, Outcome, Owner and Version, each with its synonyms to avoid.
- B. Yes, but only the terms that people see, such as Owner and Version.
- C. No: the API docs define their terms where they use them.

**5.3** When a second resource comes, which table shape should it copy (finding 2.6)?

- A. The todos shape: partition key `owner_id`, sort key `<resource>_id`. Change the template in `adding-and-removing-resources.md` to it.
- B. The template's shape (one key, `id`), and each resource chooses its own keys.
- C. Decide when the second resource comes, and mark the template as an example only.

### Names

**5.4** Should one operation have one name through every layer (section 3.2)?

- A. Yes: use the API's names everywhere (`listTodos`, `setTodoCompleted`, `restoreDemoTodos`, `useSetTodoCompleted` and so on), and remove the `…Input` aliases.
- B. Partly: keep the frontend's names, but remove the `…Input` aliases and use `CreateTodoBody` and `SetTodoCompletedBody`.
- C. No: each layer names the operation in its own words.

**5.5** Should the root `CLAUDE.md` state the file naming rules (section 3.1) and when to use `type` or `interface` (finding 3.3.4)?

- A. Yes: kebab-case in `api/` and `common/`, PascalCase for components and types, camelCase for other frontend modules; `interface` for props, `type` for everything else. Rename `interfaces/` to `types/`.
- B. Yes, the same rules, but keep the `interfaces/` folder name.
- C. Yes, and use one style everywhere: kebab-case files in every package, with PascalCase only for components.
- D. No: the current patterns are clear enough.

**5.6** Should `api/scripts/invoke.ts` move into `api/dev/` (finding 1.9)?

- A. Yes: `api/dev/` holds every local-only tool. Remove `api/scripts/`.
- B. No: `dev/` is for the dev server, and `scripts/` is for commands that you run one time.

### Security and data

**5.7** Every request uses `DEMO_OWNER_ID`, and the deployed HTTP API has no login. Anybody who finds the URL can read, change and delete the same list. The only protection is the stage limit of 10 requests per second. Is that acceptable until logins come?

- A. Yes: the dev environment holds only demo data.
- B. No: add a simple guard now, such as an API key or an IAM authorizer.
- C. No: plan the login feature next, before more data goes in.

**5.8** `replaceTodos` deletes every Todo, then writes the new ones. If a write fails in the middle, the list is part empty. Should the restore be atomic?

- A. No: the route is temporary, and a second restore fixes the list.
- B. Yes: use a DynamoDB transaction (at most 100 items).

**5.9** When does the temporary Restore Demo Todos code go away (finding 3.4.2)?

- A. With the login feature: write a ticket for it now.
- B. Never: it's useful for demos. Remove the "Temporary" comments and update `GLOSSARY.md`.
- C. Soon: the API works, so the link has done its job.

### Missing parts

**5.10** `NotFound.tsx` uses no Mantine components (finding 3.3.10). Should it?

- A. Yes: use Mantine's `Title` and `Anchor`, and the Home Page's background.
- B. No: it's a fallback that people almost never see.

**5.11** The repo has no tests, no CI (no `.github/` folder) and no `LICENSE`. Which of these should come next?

- A. Tests first: Vitest for `common/` and the API's route handlers, with the repository mocked.
- B. CI first: a GitHub Actions workflow that runs `pnpm install`, `pnpm lint` and `pnpm build` on every pull request.
- C. Both, in one change.
- D. None yet: the project is a learning project.

The `LICENSE` is a separate question: is the repo private, or should it say how others may use the code?

**5.12** The frontend has no hosting: `infra/` deploys only the API, and the HTTP API has no CORS settings. How will people reach the app outside `pnpm dev`?

- A. Add an S3 bucket and a CloudFront distribution in `infra/modules/app/`, with `/api/*` sent to the HTTP API. One origin needs no CORS.
- B. Host the frontend somewhere else, and add CORS settings to the HTTP API.
- C. Not yet: the app runs only locally for now.

Related: should the names without the `tdl` prefix (finding 3.3.5) change? The bucket would need a new bucket and a state move. The budget, the policy and the Powertools service can change in place.

**5.13** The design screenshots are 12 MB (finding 1.8). Should they stay in git?

- A. Yes: they're the planning record, and the size is acceptable.
- B. Make smaller copies (for example, WebP or a lower resolution) for new screenshots, and keep the current ones.
- C. Move them to Git LFS.

**5.14** Should the shared schemas check the API's responses in the frontend too? `todoSchema` exists (finding 1.1), but the frontend trusts the response types from `apiClient.get<Todo[]>`.

- A. Yes: parse each response with its schema in the API Functions.
- B. No: delete the export, and keep only the type.
- C. No, but keep the export for later.

### From the last audit

**5.15** Two questions from the audit of 2026-11-21 are still open:

1. Should `eslint.config.base.js` get `"@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }]`, to catch `async(`? `@stylistic/eslint-plugin` is already installed.
   - A. Yes.
   - B. No.
2. Should the proposed filename in `round_2_questions.md:75` change to the real ADR's filename?
   - A. Yes: correct it.
   - B. No: keep the record as the question was asked.

## 6. Triage: every item, from the easiest to decide to the hardest

Each finding and each question above is one item here, or part of one. The items are in three groups, from the easiest to decide to the hardest:

- **A. Fixes to make on request.** The correct change is clear. Ask for an item, or for the whole group, and Claude makes it.
- **B. Yes-or-no decisions.** One short answer settles the item. Then the change is as easy as an A item.
- **C. Decisions that need thought.** The item has several good answers, or it changes how the project works. The lettered answers are in section 5.

Each group is in order too, from the easiest item to the hardest. When an item is finished, set its **State** to **Fixed** (the change is made) or **Closed** (the item was considered and needs no change), with the date and one line about why. Mark the item's findings in sections 1 to 4 the same way.

Every change to code or docs goes through the build checks before its commit: `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start.

### A. Fixes to make on request

| # | Finding | The fix | State |
| --- | --- | --- | --- |
| A1 | 2.8 | In `docs/structure.md:353`, add `common/` to the list of `CLAUDE.md` files that the root `CLAUDE.md` points to. | **Fixed** on 2026-11-23. |
| A2 | 2.3 | In `docs/local-development.md:45`, remove "With no routes yet". Say that a request with no matching route gets API Gateway's 404. | **Fixed** on 2026-11-23. |
| A3 | 2.2 | In `docs/local-development.md:20`, say that the todos routes call DynamoDB, so the API needs an AWS sign-in. | **Fixed** on 2026-11-23. |
| A4 | 2.4 | Add `TODOS_TABLE` to the settings table in `docs/local-development.md`. | **Fixed** on 2026-11-23. |
| A5 | 2.7 | In `infra/CLAUDE.md`, change line 24 to say that `dynamodb.tf` holds each resource's table. Add rows for `aws_dynamodb_table.todos` and `aws_iam_role_policy.api_todos_table` to the "Where to find" table. | **Fixed** on 2026-11-23. |
| A6 | 2.10 | In `docs/logging.md`, replace the example route key `GET /api/articles/{article_id}` with `PATCH /api/todos/{todo_id}`. | **Fixed** on 2026-11-23. |
| A7 | 2.5 | In `docs/adding-and-removing-resources.md`, change lines 11, 25 to 31, 138 and 150: the DynamoDB packages, `dynamodb.tf` and the exports in `handler-registry.ts` already exist. Keep the "last resource" steps in "Removing a resource". | **Fixed** on 2026-11-23. |
| A8 | 3.3.8 | Change the `/* … */` comments in `frontend/tsconfig.app.json` and `tsconfig.node.json` to `//`, as in `tsconfig.base.json`. | **Fixed** on 2026-11-23. |
| A9 | 3.3.3 | Import every SCSS module as `classes`, the name that Mantine's docs use. `theme.ts` already does: change the six Pages and Shared Components that use `styles`. | **Fixed** on 2026-11-23. The Mantine bullet in the root `CLAUDE.md`'s Code conventions and the Styles bullet in `frontend/GUIDE.md` now state the rule. |
| A10 | 1.2 | Remove `export` from the `Route` type in `api/src/router/routes.ts`. | **Fixed** on 2026-11-23. |
| A11 | 3.3.2 | Rename the `id` parameters to `todoId`, as the API's route handlers name them: `updateTodo(id, input)` and `deleteTodo(id)` in `frontend/src/api/todos.ts`, the `{ id, input }` variables of `useUpdateTodo` in `frontend/src/apiHooks/todos.ts`, and the caller in `frontend/src/pages/Home/Home.tsx`. | **Fixed** on 2026-11-23. |

### B. Yes-or-no decisions

The first answer is the recommended one, for the goal in section 3.5: readable, maintainable code with no kludges. "No recommendation" marks an item that the goal doesn't settle.

| # | Finding | Question | Answers | State |
| --- | --- | --- | --- | --- |
| B1 | 2.9 | `docs/structure.md:360` lists `CODE_AUDIT.md` now. Should that entry be removed, because the file is temporary? | A. Yes: remove it. (Recommended)<br>B. No: leave it until the file goes away. | **Fixed** on 2026-11-23: the entry is gone from `structure.md`. |
| B2 | 3.3.6 | `GLOSSARY.md` says to avoid "common" for a Shared Component, but the package is named `common`. Should the two stay as they are? | A. Yes: the meanings differ. Close the item. (Recommended)<br>B. No: add a note to `GLOSSARY.md` that `common/` is the package name. | **Closed** on 2026-11-23: the two meanings differ, so both names stay. |
| B3 | 5.15.2 | Should the proposed filename in `round_2_questions.md:75` change to the real ADR's filename? | No recommendation.<br>A. Yes: correct it.<br>B. No: keep the record as the question was asked. | **Fixed** on 2026-11-23: the question now names `0001-mantine-components-with-scss-modules.md`. |
| B4 | 5.15.1 | Should `eslint.config.base.js` get the `@stylistic/space-before-function-paren` rule, to catch `async(`? | A. Yes, with only `asyncArrow` set: the repo has no `function` keyword, so the other two options do nothing. (Recommended)<br>B. Yes, with all three options.<br>C. No. | **Fixed** on 2026-11-23, with A: `{ anonymous: "ignore", named: "ignore", asyncArrow: "always" }`. Today's code passes, and a test file with `async(x)` failed with the rule. The root `CLAUDE.md` and `structure.md` list it. |
| B5 | 1.4 | Should the unused `caller_arn` and `account_id` outputs and their data source be removed from `infra/account/main.tf`? The change is local. It changes no AWS resource, but `terraform apply` removes the two outputs from the state. | A. Yes: remove them. (Recommended)<br>B. No: keep them as a quick check of who Terraform runs as. | **Fixed** on 2026-11-23: the outputs and the data source are gone. `terraform fmt -check` and `terraform validate` pass. The next `terraform apply` in `infra/account/` removes the two outputs from the state. |
| B6 | 1.7 | What should happen to the "Wayfinding operations" section in `docs/agents/issue-tracker.md`? `/setup-matt-pocock-skills` wrote it, and `/wayfinder` reads it to store its map and decision tickets in `docs/planning/`. | A. Keep it, and say in `triage-labels.md` that wayfinder tickets use `claimed` and `resolved`, never a triage label. (Recommended)<br>B. Keep it as it is.<br>C. Remove it. | **Fixed** on 2026-11-24, with A: the section stays, and `triage-labels.md` explains the wayfinder statuses. |
| B7 | 2.11 | Should both `spec.md` files say `**Status:** done`, in bold as the tickets do? `todo-list-mvp` ticket 04 is still `ready-for-agent` (see B8). | No recommendation.<br>A. Yes: both are `done`.<br>B. Only `mantine-install` is `done`. `todo-list-mvp` waits for ticket 04. | **Fixed** on 2026-11-23: both specs say `**Status:** done`. |
| B8 | 2.12 | Should you do the manual check of `todo-list-mvp` ticket 04 now, so it can be `done`? | No recommendation.<br>A. Yes: Claude writes the check's steps.<br>B. No: keep it `ready-for-agent`, and close this item. | **Fixed** on 2026-11-23: the developer did the manual check. Ticket 04 is `done`, with its box checked and a closing note in its comments. |
| B9 | 1.9, 5.6 | Should `api/scripts/invoke.ts` and `api/sample-events/` move into `api/dev/`, so one folder holds every local-only tool? | A. Yes: move both, and nodemon ignores `dev/sample-events`. (Recommended)<br>B. Move only `invoke.ts`.<br>C. Move neither. | **Fixed** on 2026-11-23, with A: `api/dev/` holds `invoke.ts` and `sample-events/`, and `api/scripts/` is gone. Saving a sample event doesn't restart the dev server: a test run checked it. |
| B10 | 3.4.1 | Should `theme.ts` and `theme.module.scss` move into a `frontend/src/theme/` folder? | No recommendation.<br>A. Yes.<br>B. No: keep them in `src/`. | **Fixed** on 2026-11-23: `frontend/src/theme/` holds `theme.ts`, `theme.module.scss` and an `index.ts` barrel, so `main.tsx` still imports from `@/theme`. |
| B11 | 3.5.1 | Should `json` in `responses.ts` write its response itself, with no `buildResponse` helper? | A. Yes. (Recommended)<br>B. No. | **Fixed** on 2026-11-23: `json` writes its response itself, and `buildResponse` and `JSON_CONTENT_TYPE` are gone. The response is unchanged. |
| B12 | 5.14 | Should the frontend's API Functions check each response with `todoSchema`? The export itself stays: see 1.1. | A. No, not now: the API and the frontend share one type, and the API checks each item when it reads it. Look at it again with C8, if the two deploy separately. (Recommended)<br>B. Yes: `getTodos`, `createTodo` and `updateTodo` parse their responses. A failed parse after a change that worked would then show "Could not save your change.", so the message needs extra handling. | **Closed** on 2026-11-24, with A: no response checks for now. C8 brings the question back. |
| B13 | 1.3 | Should the frontend remove the `CreateTodoInput` and `UpdateTodoInput` aliases, and use `CreateTodoBody` and `SetTodoCompletedBody`? | A. Yes: one name for one type. C3 can still rename the types. (Recommended)<br>B. No: decide it with C3. | **Fixed** on 2026-11-24, in commit `01707ab`: the aliases are gone, and the frontend uses `CreateTodoBody` and `SetTodoCompletedBody`. |
| B14 | 3.3.9, 3.5.2 | Should `routes.ts` check `routes.json` with one zod schema, so the methods are written once? This replaces the old idea of deriving the type with `(typeof HTTP_METHODS)[number]`, which is a type trick. | A. Yes: the zod schema. (Recommended)<br>B. No: keep the hand-written check. | **Fixed** on 2026-11-24, in commit `fc26bdb`: `routes.ts` checks `routes.json` with one zod schema, and writes the methods once. |
| B15 | 3.5.3 | How should `router.ts` look up the route handlers? `handler-registry.ts` re-exports one route handler per line, and the developer reads it as a directory of the route handlers. | A. Keep `handler-registry.ts` as it is, and explain the namespace import in `router.ts` with a clearer comment. (Recommended)<br>B. Keep everything as it is.<br>C. Export one plain object of route handlers. | **Fixed** on 2026-11-24, with A, in commit `73823ab`: `handler-registry.ts` keeps one line per route handler, and the comment in `router.ts` explains what `import * as` gives. |
| B16 | 3.5.4 | Should `todos-repository.ts` use one `toTodo` function wherever it turns an item into a Todo? | A. Yes. (Recommended)<br>B. No: keep the attribute list in `listTodos`. | **Fixed**: both ways stay, with a comment in `setTodoCompleted`. Commit `915436a`. |
| B17 | 3.5.5 | Should the `MutationCache` in `queryClient.ts` invalidate `["todos"]` for every mutation, so the API Hooks have no `onSettled`? `frontend/CLAUDE.md` and `GUIDE.md` change with it. | A. Yes: one place for what every mutation does. (Recommended)<br>B. No: each hook says what it refreshes. | **Closed**: B. Each hook says what it refreshes. |
| B18 | 3.5.6 | Should `Home.tsx` open its three confirm dialogs through one small function? | A. Yes. (Recommended)<br>B. No: three plain calls are easy to read. | **Closed**: B. The three plain calls stay. |
| B19 | 3.5.7 | Should `vite.config.ts` inject the Sass helpers through the `@/` alias, if a build shows that it works? | A. Yes, after a build on Windows and on WSL. (Recommended)<br>B. No: keep the absolute path. | **Fixed** (`b4f1324`): tested on WSL only. |
| B20 | 3.3.10, 5.10 | Should `NotFound.tsx` use Mantine components and the Home Page's look? | No recommendation.<br>A. Yes.<br>B. No: it's a fallback. | **Fixed** (`344532f`): A, with a shared `PageLayout`. |
| B21 | 3.4.3 | Should `api/dev/sample-events/todos/` get events for `invalid_id`, `not_found` and `version_conflict`? | No recommendation.<br>A. Yes: one event each.<br>B. No: the two bad requests are enough. | **Closed** on 2026-11-24, with B: the two bad requests are enough. |
| B22 | 1.5 | Should `frontend/GUIDE.md` lose its "Project layout" block and its scripts table, and point to `structure.md` and the README instead? | A. Yes: one source for each fact. (Recommended)<br>B. No: keep the GUIDE complete on its own. | **Fixed** on 2026-11-24, with A: the GUIDE's folder list and scripts table are gone, and it points to `structure.md` and the README. Its "Project layout" heading is now "Conventions", and the README and `structure.md` describe the GUIDE as "the frontend's conventions". |
| B23 | 1.8, 5.13 | Should the design screenshots stay in git as they are? | A. Yes: Git LFS or new formats add tools for no gain in the code. (Recommended)<br>B. No: see the other answers in 5.13. | **Closed** on 2026-11-24, with A: the screenshots stay in git as they are. |
| B24 | 1.6 | How should the packages list `eslint` and `typescript`? Today `eslint` is in four `package.json` files, `typescript` has two different entries, and `api` and `common` run `tsc` without listing it. | A. A pnpm catalog: each version once, in `pnpm-workspace.yaml`, and every package that runs a tool lists it as `catalog:`. (Recommended)<br>B. Only the root lists the tools.<br>C. Plain versions in each package, with `typescript` added to `api` and `common`.<br>D. Leave it as it is. | **Fixed** on 2026-11-24, with A: the catalog has `eslint: ^10.11.0` and `typescript: 6.0.3`, locked because TypeScript's minor releases can bring new type errors. `api` and `common` now list `typescript`. On 2026-11-24 the catalog also took every other dependency that two or more packages list: `@types/node`, `globals`, `typescript-eslint` and `zod`. Each `pnpm install` added and downloaded nothing, and lint, build and a test `pnpm dev` pass. The root `CLAUDE.md`'s "Keep the build green" section states the rule. |
| B25 | 5.8 | Should `replaceTodos` write the Demo Todos in one DynamoDB transaction? | A. No: a transaction adds code to a temporary route, and a second restore fixes a failed one. (Recommended)<br>B. Yes. | **Closed** on 2026-11-24, with A: no transaction, because the route is temporary. |
| B26 | 3.3.5 | Should the budget, the inline policy, the Powertools service and the local stand-in function get the `tdl` prefix? The state bucket stays as it is. The budget and the policy change in AWS: each one needs your yes first. | No recommendation.<br>A. Yes.<br>B. No: close the item. | **Closed** on 2026-11-24: the names stay as they are. |

### C. Decisions that need thought

| # | Findings | Question | State |
| --- | --- | --- | --- |
| C1 | 3.3.7 | Should `GLOSSARY.md` define the API's terms? See 5.2. | **Fixed** on 2026-11-24: `GLOSSARY.md` has a new "API" section (Resource, Route, Route Handler, Repository, Outcome), and Owner and Version in "To-do list". |
| C2 | 3.1, 3.3.4 | Should the root `CLAUDE.md` state the file naming rules, and when to use `type` or `interface`? See 5.5. For the goal in section 3.5, a written rule helps (5.5 A or C), and the choice between them is yours. | **Fixed** on 2026-11-24: the root `CLAUDE.md` states two conventions. `interface` is for a hand-written object shape. File names follow a guideline: kebab-case, with the usual exceptions (React components, the uppercase docs, tool configs, Sass partials, the grilling rounds), and others allowed with a reason. Six frontend files moved to kebab-case, and `interfaces/` is now `types/`. |
| C3 | 3.2, 3.3.1 | Should one operation have one name through every layer? This includes the route handlers and the repository functions that now share names. See 5.4. For the goal in section 3.5, 5.4 A is recommended: a search for one name then finds the whole path of one request. | **Fixed** on 2026-11-24: the renames are in commit `01707ab`, and `GLOSSARY.md` has a new "Operations" section with each operation's name. |
| C4 | 2.6 | Which table shape should a second resource copy? The answer also sets the template in `adding-and-removing-resources.md`. See 5.3. | **Closed** on 2026-11-24, with 5.3 C: decide when a second resource comes. The template in `adding-and-removing-resources.md` now points to the todos table as the real example of a table with an owner. |
| C5 | 2.1, 3.4.2 | When does the temporary Restore Demo Todos code go away? The answer also sets the Demo Todos definition in `GLOSSARY.md`. See 5.9. | **Fixed** on 2026-11-24: the Demo Todos go away some time after logins come. `GLOSSARY.md` now says that Restore Demo Todos puts them in the list, and that they exist only until the app has logins. |
| C6 | 2.13 | Should the `todos-api` work get a planning folder? See 5.1. | **Closed** on 2026-11-24: the API doesn't get a planning folder of its own, because the project already has a planning folder. |
| C7 | — | Which should come next: tests, CI or both? Does the repo need a `LICENSE`? See 5.11. | **Closed** on 2026-11-24: tests come next, and the repo needs no `LICENSE`, because it's private. |
| C8 | B12 | How will people reach the app outside `pnpm dev`? See 5.12. If the frontend and the API deploy separately, decide again whether the API Functions check each response with `todoSchema` (B12). | **Closed** on 2026-11-24: the app runs only locally for now. Later units deal with hosting, and with B12's response checks if the two deploy separately. |
| C9 | — | Is an API with no login acceptable until the login feature? See 5.7. | **Closed** on 2026-11-24: an API with no login is acceptable until logins come. |

### Progress

| Group | Items | Fixed or closed |
| --- | --- | --- |
| A. Fixes to make on request | 11 | 11 |
| B. Yes-or-no decisions | 26 | 26 |
| C. Decisions that need thought | 9 | 9 |

## 7. Draft for C1 and C3: one name for each operation, and the API's terms

A draft for the developer to review. Nothing in this section is in the code or in `GLOSSARY.md` yet. Mark each part **Agreed** or change it. The code changes start only after the whole draft is agreed.

### 7.1 One name for each operation (**Done** on 2026-11-24, in commit `01707ab`)

The rule from C3: one operation has one name through every layer, and that name is a term in `GLOSSARY.md`. The draft takes the API's names, because each one says exactly what the request does. **Bold** marks a name that changes.

| Operation (the glossary term) | Route | Route handler and repository function | API Function | API Hook | Body type |
| --- | --- | --- | --- | --- | --- |
| List Todos | `GET /api/todos` | `listTodos` | **`listTodos`** (now `getTodos`) | **`useListTodos`** (now `useTodos`) | — |
| Create Todo | `POST /api/todos` | `createTodo` | `createTodo` | `useCreateTodo` | **`CreateTodoBody`** (now also `CreateTodoInput`) |
| Set Todo Completed | `PATCH /api/todos/{todo_id}` | `setTodoCompleted` | **`setTodoCompleted`** (now `updateTodo`) | **`useSetTodoCompleted`** (now `useUpdateTodo`) | **`SetTodoCompletedBody`** (now also `UpdateTodoInput`) |
| Delete Todo | `DELETE /api/todos/{todo_id}` | `deleteTodo` | `deleteTodo` | `useDeleteTodo` | — |
| Clear Completed Todos | `DELETE /api/todos?completed=true` | `clearCompletedTodos` | `clearCompletedTodos` | `useClearCompletedTodos` | — |
| Restore Demo Todos | `POST /api/demo-todos/restore` | `restoreDemoTodos`, and the repository's **`restoreDemoTodos`** (now `replaceTodos`) | **`restoreDemoTodos`** (now `restoreTodos`) | **`useRestoreDemoTodos`** (now `useRestoreTodos`) | — |

Notes on the draft:

1. **The body types.** The `…Input` aliases go (B13), and the frontend uses the two `…Body` types from `common/`.
2. **The route handler and the repository function share each name.** A route handler and its repository function do one operation, so they get one name. The route handlers already import the repository as `* as todosRepository`, so a call reads `todosRepository.createTodo(…)`. A search for one name then finds the whole path of a request: the API Hook, the API Function, the route handler and the repository function.
3. **`useListTodos` breaks a React Query habit.** Query hooks are often named after their data (`useTodos`). The one-name rule wins here, so the hook is `useListTodos`.
4. **"Clear Completed Todos" and the button.** The design's button says "Clear Completed", and it stays as it is. The operation behind it is Clear Completed Todos.
5. **The repository's `replaceTodos`.** It deletes every Todo of an owner and writes the Todos that it gets. Under the rule, it becomes `restoreDemoTodos`, because Restore Demo Todos is its only caller. The route handler still builds the six Demo Todos and their IDs, as `createTodo`'s route handler builds the new Todo's ID.

### 7.2 New glossary entries (**Done** on 2026-11-24)

The format is `GLOSSARY-FORMAT.md`'s: a short definition of what the term is, then `_Avoid_`. Restore Demo Todos is already in `GLOSSARY.md`, and its definition stays.

**A new section, "Operations":**

**List Todos**:
Reading every Todo of one Owner, newest first.
_Avoid_: get, fetch, load

**Create Todo**:
Adding one new Active Todo.
_Avoid_: add, insert

**Set Todo Completed**:
Marking one Todo as Completed, or as Active again.
_Avoid_: update, toggle, check, complete

**Delete Todo**:
Removing one Todo for good.
_Avoid_: remove, destroy

**Clear Completed Todos**:
Deleting every Completed Todo of one Owner at once.
_Avoid_: purge, delete completed

**New entries in "To-do list":**

**Owner**:
The person a Todo belongs to. Until the app has logins, every Todo has the same Owner, the Demo Owner.
_Avoid_: user, account

**Version**:
A number on each Todo that grows by one with each change. A change that names an older Version fails, so two tabs can't overwrite each other's changes.
_Avoid_: revision, etag

**A new section, "API":**

**Resource**:
One kind of thing that the API stores and serves, with its own table, routes and folder, such as todos.
_Avoid_: entity, model, collection

**Route**:
One method and path that the API answers, listed in `api/routes.json`, such as `PATCH /api/todos/{todo_id}`.
_Avoid_: endpoint

**Route Handler**:
The function that answers one Route and returns its outcome, its log message and its response.
_Avoid_: controller, lambda

**Repository**:
The one file that reads and writes one Resource's table.
_Avoid_: DAO, store, service

**Outcome**:
The fixed code for how one request ended, such as `not_found`. The log line has it, and so does an error's body.
_Avoid_: status, result code, error code

### 7.3 What changes once the draft is agreed

- **The frontend:** `src/api/todos.ts`, `src/apiHooks/todos.ts`, `src/pages/Home/Home.tsx`, `src/interfaces/Todo.ts` (the aliases go), and the names in `frontend/CLAUDE.md` and `docs/structure.md`.
- **The API:** `replaceTodos` becomes `restoreDemoTodos` in `todos-repository.ts` and `restore-demo-todos.ts`.
- **The glossary:** the entries above.
- **The checks:** lint, build and a short `pnpm dev` start.
